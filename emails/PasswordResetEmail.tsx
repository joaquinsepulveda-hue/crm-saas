import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr } from "@react-email/components";

interface PasswordResetEmailProps {
  resetUrl: string;
}

export function PasswordResetEmail({ resetUrl }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Restablece tu contraseña</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Restablecer Contraseña</Heading>
          <Text style={text}>
            Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón para crear una nueva.
          </Text>
          <Section style={{ marginTop: 24 }}>
            <Button href={resetUrl} style={button}>
              Restablecer Contraseña
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            Este enlace vence en 1 hora. Si no solicitaste un restablecimiento de contraseña, puedes ignorar este correo.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#0a0a0f", fontFamily: "Inter, sans-serif" };
const container = { maxWidth: 480, margin: "0 auto", padding: "40px 20px" };
const h1 = { color: "#e2e2f0", fontSize: 24, fontWeight: 700, marginBottom: 16 };
const text = { color: "#a1a1aa", fontSize: 15, lineHeight: "24px" };
const button = { backgroundColor: "#6366f1", color: "#fff", borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 600, textDecoration: "none" };
const hr = { borderColor: "#1e1e2e", margin: "32px 0" };
const footer = { color: "#52525b", fontSize: 12 };
