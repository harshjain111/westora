#!/usr/bin/env python3
"""Generate data/products.fallback.ts from the Supabase seed migration.

Supabase is the source of truth for products. This produces a build-time
snapshot used ONLY when the fetch errors (see data/products.ts), so a
Supabase outage at build time cannot silently ship an empty catalogue on
a page whose entire job is credibility.

Re-run after changing 0009_products_seed.sql:
    python3 scripts/gen-product-fallback.py
"""
import json
import pathlib
import re

SEED = pathlib.Path("supabase/migrations/0009_products_seed.sql")
OUT = pathlib.Path("data/products.fallback.ts")

COLUMNS = [
    "slug", "name", "category", "origin", "origin_district", "botanical",
    "has_gi", "gi_number", "hero_line", "description", "specs", "forms",
    "packaging", "provenance", "images", "featured", "sort_order",
]


def split_records(sql: str):
    """Yield the text inside each top-level (...) record of the VALUES list."""
    body = sql[sql.index("values") + len("values"):]
    # Stop before the trailing "on conflict (slug) do nothing" — its
    # parenthesised column list would otherwise scan as an 18th record.
    if "on conflict" in body:
        body = body[:body.index("on conflict")]
    depth, start, out = 0, None, []
    in_str = False
    i = 0
    while i < len(body):
        ch = body[i]
        if body.startswith("$json$", i):
            end = body.index("$json$", i + 6) + 6
            i = end
            continue
        if in_str and ch == "\\":
            i += 2  # E'..' backslash escape: skip the escaped char
            continue
        if ch == "'":
            # '' is an escaped quote, not a close
            if in_str and i + 1 < len(body) and body[i + 1] == "'":
                i += 2
                continue
            in_str = not in_str
        elif not in_str:
            if ch == "(":
                if depth == 0:
                    start = i + 1
                depth += 1
            elif ch == ")":
                depth -= 1
                if depth == 0:
                    out.append(body[start:i])
        i += 1
    return out


def split_fields(rec: str):
    """Split one record into top-level comma-separated field tokens."""
    fields, depth, buf, in_str = [], 0, [], False
    i = 0
    while i < len(rec):
        ch = rec[i]
        if rec.startswith("$json$", i):
            end = rec.index("$json$", i + 6) + 6
            buf.append(rec[i:end])
            i = end
            continue
        if in_str and ch == "\\":
            buf.append(rec[i:i + 2])
            i += 2
            continue
        if ch == "'":
            if in_str and i + 1 < len(rec) and rec[i + 1] == "'":
                buf.append("''")
                i += 2
                continue
            in_str = not in_str
            buf.append(ch)
        elif not in_str and ch in "[(":
            depth += 1
            buf.append(ch)
        elif not in_str and ch in "])":
            depth -= 1
            buf.append(ch)
        elif not in_str and ch == "," and depth == 0:
            fields.append("".join(buf).strip())
            buf = []
        else:
            buf.append(ch)
        i += 1
    if buf:
        fields.append("".join(buf).strip())
    return fields


def parse_value(tok: str):
    tok = tok.strip()
    if tok == "null":
        return None
    if tok in ("true", "false"):
        return tok == "true"
    if tok.startswith("$json$"):
        return json.loads(tok[6:tok.rindex("$json$")])
    if tok.startswith("ARRAY["):
        inner = tok[len("ARRAY["):tok.rindex("]")]
        if not inner.strip():
            return []
        return [m.replace("''", "'").replace("\\'", "'")
                for m in re.findall(r"'((?:[^'\\\\]|\\\\.|'')*)'", inner)]
    if tok.startswith("E'") or tok.startswith("'"):
        body = tok[tok.index("'") + 1:tok.rindex("'")]
        body = body.replace("''", "'")
        if tok.startswith("E'"):
            body = body.replace("\\'", "'").replace('\\"', '"').replace("\\\\", "\\")
        return body
    if re.fullmatch(r"-?\d+", tok):
        return int(tok)
    raise ValueError(f"unparsed token: {tok[:60]}")


sql = SEED.read_text()
rows = []
for rec in split_records(sql):
    toks = split_fields(rec)
    assert len(toks) == len(COLUMNS), f"expected {len(COLUMNS)} fields, got {len(toks)}"
    rows.append({c: parse_value(t) for c, t in zip(COLUMNS, toks)})

rows.sort(key=lambda r: r["sort_order"])

products = []
for r in rows:
    p = {
        "slug": r["slug"],
        "name": r["name"],
        "category": r["category"],
        "origin": r["origin"],
        "botanical": r["botanical"],
        "hasGI": r["has_gi"],
        "heroLine": r["hero_line"],
        "description": r["description"],
        "specs": r["specs"] or [],
        "forms": r["forms"] or [],
        "packaging": r["packaging"] or [],
        "provenance": r["provenance"] or [],
        "images": r["images"] or [],
        "featured": r["featured"],
        "customFields": [],
        # 0010 adds these as null / empty for every seeded row — the
        # client enters real values via /admin/products.
        "packingSizes": [],
    }
    if r["origin_district"]:
        p["originDistrict"] = r["origin_district"]
    if r["gi_number"]:
        p["giNumber"] = r["gi_number"]
    products.append(p)

banner = f"""/**
 * GENERATED — do not edit by hand.
 * Run: python3 scripts/gen-product-fallback.py
 *
 * Build-time snapshot of supabase/migrations/0009_products_seed.sql.
 * Supabase remains the source of truth; this is used ONLY when the
 * product fetch throws, so an outage cannot ship an empty catalogue.
 * It is deliberately NOT used when Supabase returns zero rows — that is
 * a real answer (someone deleted them) and must not be overridden.
 *
 * {len(products)} products.
 */
import type {{ Product }} from "@/data/products";

export const FALLBACK_PRODUCTS: Product[] = """

OUT.write_text(banner + json.dumps(products, ensure_ascii=False, indent=2) + ";\n")
print(f"wrote {OUT} with {len(products)} products")
for p in products:
    print(f"  {p['slug']:32s} {p['category']:9s} {p['origin']}")
