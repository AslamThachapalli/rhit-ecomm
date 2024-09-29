import { atom, selector, selectorFamily } from "recoil";
import { getAllProducts } from "../../data/productsData";

export const allProductsAtom = atom<Product[]>({
    key: 'allProductsAtom',
    default: selector({
        key: 'allProductsAtomSelector',
        get: async () => {
            const products = await getAllProducts();

            return products;
        }
    })
})

export const getProductAtom = selectorFamily({
    key: 'getProductAtom',
    get: id => ({get}) => {
        const allProducts = get(allProductsAtom);

        return allProducts.find(product => product.id === id)
    }
})