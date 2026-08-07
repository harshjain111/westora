import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";

export interface AutoReplyEmailProps {
  fullName: string;
  reference: string;
}

// Core message is the same locked copy as the on-screen success panel
// (build playbook Prompt 36 / PRD FR-12.6) — the panel itself says "We've
// sent a copy to your email," so the email echoes it rather than
// introducing separate, unapproved wording.
//
// Inline hex below, not CLAUDE.md §4 tokens: email clients don't reliably
// support CSS custom properties. Values are hand-matched to the locked
// palette (see NotificationEmail.tsx for the mapping).
export function AutoReplyEmail({ fullName, reference }: AutoReplyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Enquiry received — {reference}</Preview>
      <Body style={{ fontFamily: "Georgia, serif", backgroundColor: "#f5f0e8" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "40px", maxWidth: "560px" }}>
          <Heading style={{ fontSize: "22px", margin: "0 0 16px", fontWeight: 400 }}>
            Enquiry received.
          </Heading>

          <Section>
            <Text style={{ fontSize: "15px", lineHeight: "1.6", color: "#241d17" }}>
              Hello {fullName},
            </Text>
            <Text style={{ fontSize: "15px", lineHeight: "1.6", color: "#241d17" }}>
              We&apos;ve sent a copy to your email. Someone from our team will reply within one
              working day — usually sooner.
            </Text>
            <Text
              style={{
                fontFamily: "monospace",
                fontSize: "13px",
                letterSpacing: "0.02em",
                color: "#241d17",
                marginTop: "24px",
              }}
            >
              Reference: {reference}
            </Text>
          </Section>

          <Hr style={{ borderColor: "#e4e4e4", margin: "24px 0" }} />

          <Text style={{ fontSize: "12px", color: "#717171" }}>Westora Global</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default AutoReplyEmail;
