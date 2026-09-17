import { ImageResponse } from "next/og";
export const alt = "Reziyume — Beautiful resumes. Built in 2 minutes.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(<div style={{ background: "#faf9f6", color: "#294c3e", width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "70px 80px", justifyContent: "space-between" }}><div style={{ fontSize: 32 }}>reziyume.</div><div style={{ display: "flex", flexDirection: "column", fontSize: 76, letterSpacing: -3 }}><span>Beautiful resumes.</span><span style={{ color: "#74846b" }}>Built in 2 minutes.</span></div><div style={{ fontSize: 24 }}>Professional templates · Easy editing · Free PDF downloads</div></div>, size);
}
