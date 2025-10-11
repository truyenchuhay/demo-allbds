import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET() {
    // URL ảnh bạn muốn gửi về
    const imageUrl = "https://static2.truyenchuonl.com/avatar/user/default.jpg";

    // Lấy ảnh từ URL
    const res = await fetch(imageUrl);

    if (!res.ok) {
        return notFound()
    }

    // Lấy body và content-type từ response gốc
    const blob = await res.arrayBuffer();
    const headers = new Headers();
    headers.set("Content-Type", "image/jpeg"); // loại ảnh

    return new NextResponse(blob, { status: 200, headers });
}
