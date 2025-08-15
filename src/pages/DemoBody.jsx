import React from "react";
import BodyImage from "../components/BodyImage";

export default function DemoBody() {
  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 16 }}>
      <BodyImage src="/images/corpohumano.png" alt="Corpo Humano" />
    </div>
  );
}
