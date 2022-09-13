
export class LocalStorageUtil {
    static thumbnailStorageName: string = 'thumbnail_dimensions';

    public static addToStorage(height: number, width: number) {
        let obj = {'height': height, 'width': width}
        localStorage.setItem(LocalStorageUtil.thumbnailStorageName, JSON.stringify(obj));
    }
    
    public static retrieveThumbnailDimensions() {
        return localStorage.getItem(LocalStorageUtil.thumbnailStorageName) || '';
    }

    public static clearStorage() {
        localStorage.removeItem(LocalStorageUtil.thumbnailStorageName);
    }
}

