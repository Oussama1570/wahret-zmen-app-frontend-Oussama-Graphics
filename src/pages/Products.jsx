import React, { useState, useEffect } from "react";
import ProductCard from "../../src/pages/products/ProductCard.jsx";
import { useGetAllProductsQuery } from "../redux/features/products/productsApi.js";
import SelectorsPageProducts from "../components/SelectorProductsPage.jsx";
import SearchInput from "../components/SearchInput.jsx";
import "../Styles/StylesProducts.css";
import { Helmet } from "react-helmet";
import FadeInSection from "../Animations/FadeInSection";
import { useDispatch, useSelector } from "react-redux";
import { resetRefetch } from "../redux/features/products/productEventsSlice.js";
import { useTranslation } from "react-i18next";

const WahretZmenLoader = () => (
  <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
);

const categories = ["All", "Men", "Women", "Children"];

const Products = () => {
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadMore, setLoadMore] = useState(8);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    data: products = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetAllProductsQuery(undefined, {
    pollingInterval: 2500,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  const shouldRefetch = useSelector((state) => state.productEvents.shouldRefetch);

  useEffect(() => {
    if (shouldRefetch) {
      refetch();
      dispatch(resetRefetch());
    }
  }, [shouldRefetch, refetch, dispatch]);

  const filteredProducts = products
    .filter((product) => {
      const matchesCategory =
        selectedCategories.includes("All") ||
        selectedCategories.some(
          (cat) => cat.toLowerCase() === product.category.toLowerCase()
        );

      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    })
    .slice(0, loadMore);

  const handleLoadMore = () => {
    setLoadMore((prev) => prev + 8);
  };

  return (
    <FadeInSection>
      <div className="main-content">
        <div className="container mx-auto py-10 px-4 sm:px-6 md:px-10 lg:px-20 max-w-[1440px]">
          <Helmet>
            <title>{t("products_page.title")} - Wahret Zmen</title>
          </Helmet>

          <FadeInSection>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-center mb-6 drop-shadow-lg bg-gradient-to-r from-[#D4AF37] to-[#A67C52] bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 ease-in-out">
              {t("products_page.title")}
            </h2>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            <div className="text-center text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed px-2">
              <p className="text-base sm:text-lg">{t("products_page.overview")}</p>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.3}>
            <div className="mb-8 flex flex-col items-center space-y-4">
              <h3 className="category-title text-lg font-medium text-[#5a382d]">
                {t("category")}
              </h3>
              <SelectorsPageProducts
                options={categories}
                onSelect={setSelectedCategories}
                label="category"
              />
              <SearchInput
                setSearchTerm={setSearchTerm}
                placeholder={t("search_placeholder")}
              />
            </div>
          </FadeInSection>

          <FadeInSection delay={0.4}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  {t("no_products_found")}
                </p>
              )}
            </div>
          </FadeInSection>

          {filteredProducts.length < products.length && (
            <FadeInSection delay={0.5}>
              <div className="text-center mt-8">
                <button className="wahret-zmen-btn" onClick={handleLoadMore}>
                  {t("load_more")}
                </button>
              </div>
            </FadeInSection>
          )}
        </div>
      </div>
    </FadeInSection>
  );
};

export default Products;
