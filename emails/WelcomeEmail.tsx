import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  firstName: string;
  workspaceName: string;
  appUrl: string;
}

export function WelcomeEmail({ firstName, workspaceName, appUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>¡Bienvenido/a a {workspaceName} — tu CRM está listo!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>¡Bienvenido/a, {firstName}!</Heading>
          <Text style={text}>
            Tu espacio de trabajo <strong>{workspaceName}</strong> está configurado. Empieza a agregar contactos,
            registrar negocios y cerrar más ventas.
          </Text>
          <Section style={{ marginTop: 24 }}>
            <Button href={`${appUrl}/dashboard`} style={button}>
              Ir al Panel
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            ¿Necesitas ayuda? Responde este correo en cualquier momento.
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
const button = {
  backgroundColor: "#6366f1", color: "#fff", borderRadius: 8,
  padding: "12px 24px", fontSize: 14, fontWeight: 600, textDecoration: "none",
};
const hr = { borderColor: "#1e1e2e", margin: "32px 0" };
const footer = { color: "#52525b", fontSize: 12 };
