import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr } from "@react-email/components";

interface DealWonEmailProps {
  recipientName: string;
  dealTitle: string;
  dealValue: string;
  contactName: string;
  appUrl: string;
  dealId: string;
}

export function DealWonEmail({ recipientName, dealTitle, dealValue, contactName, appUrl, dealId }: DealWonEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>🎉 Negocio ganado: {dealTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>¡Negocio ganado! 🎉</Heading>
          <Text style={text}>
            ¡Felicidades, {recipientName}! Cerraste <strong>{dealTitle}</strong> con <strong>{contactName}</strong> por <strong>{dealValue}</strong>.
          </Text>
          <Section style={{ marginTop: 24 }}>
            <Button href={`${appUrl}/deals/${dealId}`} style={button}>
              Ver Negocio
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>¡Sigue así, vas muy bien!</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#0a0a0f", fontFamily: "Inter, sans-serif" };
const container = { maxWidth: 480, margin: "0 auto", padding: "40px 20px" };
const h1 = { color: "#e2e2f0", fontSize: 24, fontWeight: 700, marginBottom: 16 };
const text = { color: "#a1a1aa", fontSize: 15, lineHeight: "24px" };
const button = { backgroundColor: "#10b981", color: "#fff", borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 600, textDecoration: "none" };
const hr = { borderColor: "#1e1e2e", margin: "32px 0" };
const footer = { color: "#52525b", fontSize: 12 };
