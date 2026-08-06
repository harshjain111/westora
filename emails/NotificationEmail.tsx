import { Body, Container, Head, Heading, Hr, Html, Link, Preview, Row, Column, Section, Text } from "@react-email/components";

export interface NotificationEmailProps {
  reference: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  country: string;
  products: string[];
  volume?: string;
  destinationPort?: string;
  message?: string;
  sourceSection: string;
  sourceProduct?: string;
  adminUrl: string;
}

// Internal, operational content (not customer-facing brand copy) — plain
// and scannable so it reads well on a phone, per build playbook Prompt 39.
//
// Inline hex below, not CLAUDE.md §4 tokens: email clients (Gmail,
// Outlook, etc.) don't reliably support CSS custom properties, so the
// token system can't reach here. Values are hand-matched to the locked
// palette instead — #faf7f2 surface, #ffffff surface-raised, #1a1a1a ink,
// #8a6a2c accent, #717171 an ink-muted approximation.
export function NotificationEmail({
  reference,
  fullName,
  companyName,
  email,
  phone,
  country,
  products,
  volume,
  destinationPort,
  message,
  sourceSection,
  sourceProduct,
  adminUrl,
}: NotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New enquiry — {products.join(", ")} — {companyName} ({country})</Preview>
      <Body style={{ fontFamily: "Helvetica, Arial, sans-serif", backgroundColor: "#faf7f2" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "32px", maxWidth: "560px" }}>
          <Heading style={{ fontSize: "20px", margin: "0 0 4px" }}>New enquiry</Heading>
          <Text style={{ color: "#717171", fontSize: "13px", margin: "0 0 24px" }}>
            Reference {reference} · via {sourceSection}
            {sourceProduct ? ` (${sourceProduct})` : ""}
          </Text>

          <Section>
            <Row>
              <Column>
                <Text style={{ margin: "0 0 2px", fontSize: "12px", color: "#717171" }}>Name</Text>
                <Text style={{ margin: "0 0 16px", fontSize: "15px" }}>{fullName}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={{ margin: "0 0 2px", fontSize: "12px", color: "#717171" }}>Company</Text>
                <Text style={{ margin: "0 0 16px", fontSize: "15px" }}>{companyName}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={{ margin: "0 0 2px", fontSize: "12px", color: "#717171" }}>Email</Text>
                <Text style={{ margin: "0 0 16px", fontSize: "15px" }}>{email}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={{ margin: "0 0 2px", fontSize: "12px", color: "#717171" }}>Phone</Text>
                <Text style={{ margin: "0 0 16px", fontSize: "15px" }}>{phone}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={{ margin: "0 0 2px", fontSize: "12px", color: "#717171" }}>Country</Text>
                <Text style={{ margin: "0 0 16px", fontSize: "15px" }}>{country}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={{ margin: "0 0 2px", fontSize: "12px", color: "#717171" }}>Products</Text>
                <Text style={{ margin: "0 0 16px", fontSize: "15px" }}>{products.join(", ")}</Text>
              </Column>
            </Row>
            {volume && (
              <Row>
                <Column>
                  <Text style={{ margin: "0 0 2px", fontSize: "12px", color: "#717171" }}>
                    Estimated volume
                  </Text>
                  <Text style={{ margin: "0 0 16px", fontSize: "15px" }}>{volume}</Text>
                </Column>
              </Row>
            )}
            {destinationPort && (
              <Row>
                <Column>
                  <Text style={{ margin: "0 0 2px", fontSize: "12px", color: "#717171" }}>
                    Destination port
                  </Text>
                  <Text style={{ margin: "0 0 16px", fontSize: "15px" }}>{destinationPort}</Text>
                </Column>
              </Row>
            )}
            {message && (
              <Row>
                <Column>
                  <Text style={{ margin: "0 0 2px", fontSize: "12px", color: "#717171" }}>Message</Text>
                  <Text style={{ margin: "0 0 16px", fontSize: "15px" }}>{message}</Text>
                </Column>
              </Row>
            )}
          </Section>

          <Hr style={{ borderColor: "#e4e4e4", margin: "24px 0" }} />

          <Link href={adminUrl} style={{ fontSize: "14px", color: "#8a6a2c" }}>
            Open in admin →
          </Link>
        </Container>
      </Body>
    </Html>
  );
}

export default NotificationEmail;
