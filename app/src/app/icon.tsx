import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const logo = fs.readFileSync(
    path.join(process.cwd(), "public/brand/logo-mark.png"),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FCFBF9",
          borderRadius: 6,
        }}
      >
        <img src={logoSrc} height={26} alt="" />
      </div>
    ),
    { ...size },
  );
}
