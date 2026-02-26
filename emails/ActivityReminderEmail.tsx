import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr } from "@react-email/components";

interface ActivityReminderEmailProps {
  contactName: string;
  activityTitle: string;
  activityType: string;
  dueAt: string;
  appUrl: string;
}

export function ActivityReminderEmail({ contactName, activityTitle, activityType, dueAt, appUrl }: ActivityReminderEmailProps) {
  const formattedDate = new Date(dueAt).toLocaleDateString("es-MX", {
    weekday: "long", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <Html>
      <Head />
      <Preview>Recordatorio: {activityType} con {contactName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Recordatorio de Actividad</Heading>
          <Text style={text}>
            Tienes un/a <strong>{activityType}</strong> programado/a: <strong>{activityTitle}</strong>
          </Text>
          <Text style={text}>
            <strong>Con:</strong> {contactName}<br />
            <strong>Cuándo:</strong> {formattedDate}
          </Text>
          <Section style={{ marginTop: 24 }}>
            <Button href={`${appUrl}/activities`} style={button}>
              Ver Actividad
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>Estás recibiendo esto porque activaste los recordatorios de actividades.</Text>
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
