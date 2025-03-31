import React, { useState, useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { useGetProductByIdQuery } from "../../redux/features/products/productsApi";
import "../../Styles/StylesSingleProduct.css";
import { useTranslation } from "react-i18next";

const SingleProduct = () => {
  const { id } = useParams();
  const { data: product, isLoading, isError } = useGetProductByIdQuery(id);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const { t, i18n } = useTranslation(); // ✅ Correctly defined i18n

  // ✅ Translated category based on the selected language
const categoryKey = product?.category?.toLowerCase(); // Convert to lowercase to match i18n keys
const translatedCategory = t(`categories.${categoryKey}`, product?.category); // Fallback to original if not found

  // ✅ Dynamic translation based on selected language
  const lang = i18n.language;
  const translatedTitle = product?.translations?.[lang]?.title || product?.title;
  const translatedDescription = product?.translations?.[lang]?.description || product?.description;

  useEffect(() => {
    if (product) {
      setSelectedColor(
        product.colors?.[0] || {
          colorName: "Default",
          image: product?.coverImage || "/assets/default-image.png",
        }
      );
    }
  }, [product]);

  if (isLoading)
    return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (isError || !product)
    return (
      <div className="text-center py-10 text-red-600">Error loading product info</div>
    );

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    setQuantity(
      value > (product?.stockQuantity ?? 0) ? (product?.stockQuantity ?? 0) : value
    );
  };

  const handleSelectColor = (color) => {
    setSelectedColor(color);
  };

  const handleAddToCart = () => {
    if ((product?.stockQuantity ?? 0) > 0 && quantity > 0) {
      dispatch(
        addToCart({
          ...product,
          quantity,
          color: selectedColor,
        })
      );
    }
  }; 

  return (
    <div className="max-w-5xl mx-auto shadow-lg p-8 bg-[#F5EFE6] rounded-lg border border-[#A67C52] product-cart">
      <h1 className="text-4xl font-semibold text-[#8B5E3B] mb-6 text-center font-serif">
        {translatedTitle}
      </h1>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative border border-[#A67C52] rounded-lg overflow-hidden group">
          <img
            src={getImgUrl(selectedColor?.image ?? "/assets/default-image.png")}
            alt={translatedTitle}
            className="w-full rounded-lg shadow-md transition-transform duration-300 group-hover:scale-110"
          />
        </div> 

        {/* Product Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-semibold mb-2">{translatedTitle}</h1>

          <p className="text-gray-600 text-base mb-4">{translatedDescription}</p>

          <div className="flex justify-between w-full">
            <div className="w-2/3">
            <p className="text-[#6B4226] mb-2 text-lg">
  <strong>{t("category")}:</strong> {translatedCategory}
</p>

              <p className="text-[#6B4226] mb-4 text-lg">
                <strong>{t("published")}:</strong>{" "}
                {product?.createdAt ? new Date(product.createdAt).toLocaleDateString() : t("unknown")}
              </p>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                {translatedDescription ?? t("no_description")}
              </p>

              <p className="text-3xl font-semibold mb-6">
                <span className="text-[#8B5E3B]">${product?.newPrice ?? "0.00"}</span>
                {product?.oldPrice && (
                  <span className="text-gray-500 line-through ml-3 text-xl">
                    ${Math.round(product?.oldPrice)}
                  </span>
                )}
              </p>

              <div className="flex items-center mb-6">
                <label className="mr-4 font-medium text-[#6B4226] text-lg">
                  {t("quantity")}:
                </label>
                <input
                  type="number"
                  min="1"
                  max={product?.stockQuantity ?? 0}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="border rounded px-4 py-2 w-24 text-center text-lg border-[#A67C52]"
                  disabled={(product?.stockQuantity ?? 0) === 0}
                />
              </div>

              <button
                onClick={handleAddToCart}
                disabled={(product?.stockQuantity ?? 0) === 0}
                className={`w-full py-4 rounded-lg text-white font-medium text-xl transition-all ${
                  (product?.stockQuantity ?? 0) > 0
                    ? "bg-[#8B5E3B] hover:bg-[#6B4226]"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                <FiShoppingCart className="inline mr-3 text-2xl" />
                {(product?.stockQuantity ?? 0) > 0 ? t("add_to_cart") : t("out_of_stock")}
              </button>
            </div>

            <div className="w-1/3 flex flex-col items-center">
              <label className="block mb-3 font-medium text-lg text-[#6B4226]">
                {t("select_color")}:
              </label>

              <div className="flex flex-col gap-3 items-center">
                {product?.colors?.map((color, index) => (
                  <img
                    key={index}
                    src={getImgUrl(color?.image ?? "/assets/default-image.png")}
                    alt={color?.colorName?.[lang] || color?.colorName?.en || "Default"}
                    className={`w-16 h-16 object-cover rounded cursor-pointer border-4 transition-all ${
                      selectedColor?.colorName?.en === color?.colorName?.en

                        ? "border-[#8B5E3B]" 
                        : "border-transparent"
                    }`}
                    onClick={() => handleSelectColor(color)}
                  />
                ))} 
              </div>

              <p className="mt-3 text-lg text-[#6B4226]">
                {t("selected")}:{" "}
                <strong className="capitalize">
                {selectedColor?.colorName?.[lang] || selectedColor?.colorName?.en || t("default")}

                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
