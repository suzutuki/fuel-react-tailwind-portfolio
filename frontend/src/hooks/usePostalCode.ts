import { useState } from "react";

interface PostalCodeResponse {
    prefecture: string;
    address1: string;
    address2: string;
    address3: string;
}

/**
 * 郵便番号から住所を取得するカスタムフック
 * zipcloud APIを使用して郵便番号から住所情報を取得
 */
export const usePostalCode = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * 郵便番号を正規化（ハイフンを削除して7桁の数字にする）
     */
    const normalizePostalCode = (postalCode: string): string => {
        return postalCode.replace(/[-\s]/g, '');
    };

    /**
     * 郵便番号から住所を取得
     * @param postalCode 郵便番号（7桁、ハイフンありなし両方対応）
     * @returns 住所情報（都道府県、市区町村以降の住所）
     */
    const fetchAddress = async (postalCode: string): Promise<PostalCodeResponse | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const normalized = normalizePostalCode(postalCode);

            // 7桁の数字でない場合はエラー
            if (!/^\d{7}$/.test(normalized)) {
                throw new Error('郵便番号は7桁の数字で入力してください');
            }

            // zipcloud API を使用
            const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${normalized}`);

            if (!response.ok) {
                throw new Error('郵便番号の検索に失敗しました');
            }

            const data = await response.json();

            // APIからのエラーチェック
            if (data.status !== 200) {
                throw new Error(data.message || '郵便番号の検索に失敗しました');
            }

            // 結果が見つからない場合
            if (!data.results || data.results.length === 0) {
                throw new Error('該当する住所が見つかりませんでした');
            }

            // 最初の結果を返す
            const result = data.results[0];
            return {
                prefecture: result.address1, // 都道府県
                address1: result.address2,   // 市区町村
                address2: result.address3,   // 町域
                address3: '',                 // 番地以降は空
            };

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '住所の取得に失敗しました';
            setError(errorMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        fetchAddress,
        isLoading,
        error,
    };
};