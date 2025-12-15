import { CATEGORY_ICONS } from "../utils/categoryIcons";
import { CATEGORY_NAME_TO_KEY } from "../utils/categoryNameToKey";

interface TopCategory {
  categoryName: string;
  totalAmount: number;
}

interface TopCategoryCardProps {
  data: TopCategory[];
}

export default function TopCategoryCard({ data }: TopCategoryCardProps) {
  if (!data || data.length === 0) return null;
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-semibold mb-3">가장 많이 쓴 카테고리 Top 3</h2>

      <div className="flex flex-col gap-3">
        {data.map((item, idx) => {
          const key = CATEGORY_NAME_TO_KEY[item.categoryName] ?? "ETC";
          const icon = CATEGORY_ICONS[key];

          return (
            <div
              key={idx}
              className="flex justify-between bg-gray-50 p-3 rounded-lg"
            >
              <span className="font-medium">
                {icon} {item.categoryName}
              </span>

              <span className="font-semibold">
                {(item.totalAmount ?? 0).toLocaleString()}원
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
