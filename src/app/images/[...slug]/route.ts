import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string[] } } // 'slug' là một mảng string do sử dụng [...slug]
) {
    // 1. Lấy headersList (phải là await)
    const headersList = await headers();
    const { slug } = await params

    // 2. Trích xuất Host (headersList.get() là đồng bộ, KHÔNG cần await)
    // Cảnh báo Next.js sẽ biến mất khi bạn không await các hàm đồng bộ này.
    const host = headersList.get("host")?.replace(":3000", "") || "";

    // 3. Xây dựng Full Slug (params.slug.join('/') là đồng bộ, KHÔNG cần await)
    const fullSlug = slug.join('/');

    // 4. Tính toán File URL (sử dụng biến môi trường URL_FILE_STATIC)
    // Lưu ý: Đảm bảo biến môi trường này được định nghĩa khi deploy lên Edge.
    const fileUrl = `${process.env.URL_FILE_STATIC}/diaocdautu.com.vn/images/${fullSlug}`;

    try {
        // Fetch ảnh từ URL gốc
        const response = await fetch(fileUrl);

        if (!response.ok) {
            return notFound()
        }

        // Lấy content-type từ response để trả về đúng định dạng ảnh (jpeg/png/webp...)
        const contentType = response.headers.get('content-type') || 'image/jpeg';

        // Trả về file ảnh như response gốc
        return new NextResponse(response.body, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        return notFound()
    }
}
