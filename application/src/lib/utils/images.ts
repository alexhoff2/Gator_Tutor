export function getImagePath(path: string | null): string {
    if (!path) return "/images/blank-pfp.png";

    if (path.startsWith("http")) return path;

    const cleanPath = path.replace(/^\+/, "");
    return `/${cleanPath}`;
    
}