import { Contact2 } from "@/components/ui/contact-2";

export default function DemoRequest() {
  return (
    <Contact2 
      title="Request a Demo"
      description="Get in touch with our team to see how CamVitals can transform your workplace wellness program. We're here to help you enhance employee well-being and boost productivity."
      phone="(555) 123-4567"
      email="hi@camvitals.com"
      web={{ label: "camvitals.com", url: "https://camvitals.com" }}
    />
  );
} 