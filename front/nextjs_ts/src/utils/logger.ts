// Helper function for consistent logging
export const log = (
    func_name: string, 
    level: 'info' | 'error' | 'debug', 
    message: string, 
    data?: unknown
) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${func_name}] [${level.toUpperCase()}] ${message}`;
    if (data) {
        console.log(logMessage, data);
    } else {
        console.log(logMessage);
    }
}