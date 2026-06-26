export default function ResponseHandler(statusCode: number, message: string, data?: any) {
    return { statusCode, message, data: data || null };
}