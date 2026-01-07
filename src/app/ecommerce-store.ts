import { computed, inject } from "@angular/core";
import { Product } from "./models/product"
import { patchState, signalMethod, signalStore, withComputed, withMethods, withState } from "@ngrx/signals"
import { produce } from "immer"
import { Toaster } from "./services/toaster";
import { CartItem } from "./models/cart";
import { MatDialog } from "@angular/material/dialog";
import { SignInDialog } from "./components/sign-in-dialog/sign-in-dialog";
import { SignInParams, SignUpParams, User } from "./models/user";
import { Router } from "@angular/router";
import { Order } from "./models/order";

export type EcommerceState = {
    products: Product[];
    category: string;
    wishlistItems: Product[];
    cartItems: CartItem[];
    user: User | undefined;
    loading: boolean;
    selectedProductId: string | undefined
};

export const EcommerceStore = signalStore(
    {
        providedIn: 'root'
    },
    withState({
        products: [
            { id: 'p1', name: 'Classic Tee', description: '100% cotton unisex t-shirt', price: 19.99, imageUrl: 'pexels-photo-8148576.png', rating: 4.5, reviewCount: 120, inStock: true, category: 'apparel' },
            { id: 'p2', name: 'Running Sneakers', description: 'Lightweight running shoes', price: 79.99, imageUrl: 'pexels-photo-19577864.png', rating: 4.7, reviewCount: 89, inStock: false, category: 'footwear' },
            { id: 'p3', name: 'Bluetooth Headphones', description: 'Noise-cancelling over-ear headphones', price: 129.99, imageUrl: 'pexels-photo-5269759.png', rating: 4.3, reviewCount: 42, inStock: true, category: 'electronics' },
            { id: 'p4', name: 'Denim Jacket', description: 'Classic blue denim jacket', price: 59.99, imageUrl: 'pexels-photo-1105058.png', rating: 4.2, reviewCount: 34, inStock: true, category: 'apparel' },
            { id: 'p5', name: 'Stainless Kettle', description: '1.7L electric kettle', price: 39.99, imageUrl: 'pexels-photo-6933130.png', rating: 4.1, reviewCount: 18, inStock: true, category: 'kitchen' },
            { id: 'p6', name: 'Yoga Mat', description: 'Non-slip fitness mat', price: 25.00, imageUrl: 'pexels-photo-4327014.png', rating: 4.6, reviewCount: 76, inStock: false, category: 'sports' },
            { id: 'p7', name: 'Smart Watch', description: 'Heart-rate and activity tracking', price: 199.99, imageUrl: 'pexels-photo-437037.png', rating: 4.4, reviewCount: 210, inStock: false, category: 'electronics' },
            { id: 'p8', name: 'Leather Wallet', description: 'Slim bifold wallet', price: 29.99, imageUrl: 'pexels-photo-915915.png', rating: 4.0, reviewCount: 12, inStock: true, category: 'accessories' },
            { id: 'p9', name: 'Coffee Grinder', description: 'Manual burr grinder', price: 45.00, imageUrl: 'pexels-photo-1309778.png', rating: 4.5, reviewCount: 53, inStock: true, category: 'kitchen' },
            { id: 'p10', name: 'Sunglasses', description: 'Polarized UV protection', price: 49.99, imageUrl: 'pexels-photo-5333043.png', rating: 4.3, reviewCount: 98, inStock: true, category: 'accessories' },
            { id: 'p11', name: 'Backpack', description: 'Water-resistant travel backpack', price: 69.99, imageUrl: 'pexels-photo-842947.png', rating: 4.6, reviewCount: 159, inStock: true, category: 'bags' },
            { id: 'p12', name: 'Desk Lamp', description: 'LED adjustable desk lamp', price: 22.50, imageUrl: 'pexels-photo-1112598.png', rating: 4.2, reviewCount: 27, inStock: true, category: 'home' },
            { id: 'p13', name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', price: 24.99, imageUrl: 'pexels-photo-392018.png', rating: 4.1, reviewCount: 66, inStock: true, category: 'electronics' },
            { id: 'p14', name: 'Water Bottle', description: 'Insulated stainless steel bottle', price: 19.99, imageUrl: 'pexels-photo-3766180.png', rating: 4.4, reviewCount: 44, inStock: true, category: 'accessories' },
            { id: 'p15', name: 'Beanie', description: 'Warm knit beanie', price: 14.99, imageUrl: 'pexels-photo-375880.png', rating: 4.2, reviewCount: 22, inStock: true, category: 'apparel' },
            { id: 'p16', name: 'Electric Toothbrush', description: 'Rechargeable sonic toothbrush', price: 39.99, imageUrl: 'pexels-photo-8823972.png', rating: 4.3, reviewCount: 49, inStock: true, category: 'personal care' },
            { id: 'p17', name: 'Portable Charger', description: '10000mAh power bank', price: 29.99, imageUrl: 'pexels-photo-19810744.png', rating: 4.5, reviewCount: 88, inStock: true, category: 'electronics' },
            { id: 'p18', name: 'Kitchen Knife Set', description: '3-piece stainless steel knives', price: 34.99, imageUrl: 'pexels-photo-18977916.png', rating: 4.0, reviewCount: 31, inStock: true, category: 'kitchen' },
            { id: 'p19', name: 'Ylanite Koppens', description: 'Soft and clean knitted', price: 49.99, imageUrl: 'pexels-photo-934070.png', rating: 4.1, reviewCount: 75, inStock: true, category: 'clothing' },
            { id: 'p20', name: 'Koroloa G', description: 'Soft and clean knitted', price: 59.99, imageUrl: 'pexels-photo-4495705.png', rating: 4.2, reviewCount: 75, inStock: false, category: 'clothing' },
            { id: 'p21', name: 'Kal Pliger', description: 'Soft and clean knitted', price: 69.99, imageUrl: 'pexels-photo-996329.png', rating: 4.3, reviewCount: 75, inStock: true, category: 'clothing' },
            { id: 'p22', name: 'Dom J', description: 'Soft and clean knitted', price: 79.99, imageUrl: 'pexels-photo-45982.png', rating: 4.4, reviewCount: 75, inStock: true, category: 'clothing' },
            { id: 'p23', name: 'Laptop Sleeve', description: 'Protective 13-inch sleeve', price: 21.99, imageUrl: 'pexels-photo-89723.png', rating: 4.2, reviewCount: 20, inStock: true, category: 'bags' }
        ],
        category: 'all',
        wishlistItems: [],
        cartItems: [],
        user: undefined,
        loading: false,
        selectedProductId: undefined
    } as EcommerceState),
    withComputed(({ category, products, wishlistItems, cartItems, selectedProductId }) => ({
        filteredProducts: computed(() => {
            if (category() === 'all') return products();
            return products().filter(p => p.category === category().toLowerCase());
        }),
        wishlistCount: computed(() => wishlistItems().length),
        cartCount: computed(() => cartItems().reduce((acc, item) => acc + item.quantity, 0)),
        selectedProduct: computed(() => products().find((p) => p.id === selectedProductId()))

    })),
    withMethods((store, toaster = inject(Toaster), matDialog = inject(MatDialog), router = inject(Router)) => ({
        setCategory: signalMethod<string>(
            (category: string) => {
                patchState(store, { category })
            }
        ),
        setProductId: signalMethod<string>((productId: string) => {
            patchState(store, { selectedProductId: productId });
        }),
        addToWishList: (product: Product) => {
            const updatedWishListItems = produce(store.wishlistItems(), (draft) => {
                if (!draft.find((p) => p.id === product.id)) {
                    draft.push(product)
                }
            })
            patchState(store, { wishlistItems: updatedWishListItems })
            toaster.success("Product added to WishList");
        },
        removeFromWishList: (product: Product) => {
            patchState(store, { wishlistItems: store.wishlistItems().filter((p) => { p.id !== product.id }) })
            toaster.success("Product removed from WishList");
        },
        clearWishList: () => {
            patchState(store, { wishlistItems: [] })
        },
        addToCart: (product: Product, quantity = 1) => {
            const existingItemIndex = store.cartItems().findIndex(i => i.product.id === product.id);
            const updatedCartItem = produce(store.cartItems(), (draft) => {
                if (existingItemIndex !== -1) {
                    draft[existingItemIndex].quantity += quantity;
                    return;
                }
                draft.push({ product, quantity })
            });
            patchState(store, { cartItems: updatedCartItem })
            toaster.success(existingItemIndex !== -1 ? 'Product added again' : 'Product added to the cart')
        },
        setItemQuantity(params: { productId: string, quantity: number }) {
            const index = store.cartItems().findIndex(c => c.product.id === params.productId);
            const updated = produce(store.cartItems(), (draft) => {
                draft[index].quantity = params.quantity
            });
            patchState(store, { cartItems: updated });
        },
        addAllWishListToCart: () => {
            const updatedCartItems = produce(store.cartItems(), (draft) => {
                store.wishlistItems().forEach(p => {
                    if (!draft.find(c => c.product.id === p.id)) {
                        draft.push({ product: p, quantity: 1 });
                    }
                })
            })
            patchState(store, { cartItems: updatedCartItems, wishlistItems: [] })
        },
        moveToWishlist: (product: Product) => {
            const updatedCartItems = store.cartItems().filter((p) => p.product.id !== product.id);
            const updatedWishListItems = produce(store.wishlistItems(), (draft) => {
                if (!draft.find((p) => p.id === product.id)) {
                    draft.push(product);
                }
            })
            patchState(store, { cartItems: updatedCartItems, wishlistItems: updatedWishListItems })
        },
        removeFromCart: (product: Product) => {
            patchState(store, {
                cartItems: store.cartItems().filter((c) => c.product.id !== product.id)
            })
        },
        proceedToCheckout: () => {
            if (!store.user()) {
                matDialog.open(SignInDialog, {
                    disableClose: true,
                    data: {
                        checkout: true
                    }
                });
                return;
            }
            router.navigate(['/checkout']);
        },
        signIn: ({ email, password, checkout, dialogId }: SignInParams) => {
            patchState(store, {
                user: {
                    id: '1',
                    email,
                    name: 'John Doe',
                    imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
                },
            })
            const dialog = matDialog.getDialogById(dialogId)?.close();
            if (checkout) {
                router.navigate(['/checkout'])
            }
        },
        signUp: ({ email, password, name, checkout, dialogId }: SignUpParams) => {
            patchState(store, {
                user: {
                    id: '1',
                    email,
                    name: 'John Doe',
                    imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
                },
            })
            const dialog = matDialog.getDialogById(dialogId)?.close();
            if (checkout) {
                router.navigate(['/checkout'])
            }

        },
        signOut: () => {
            patchState(store, { user: undefined })
        },
        placeOrder: async () => {
            patchState(store, { loading: true });
            const user = store.user();
            if (!user) {
                toaster.error("Please login before placing order");
                patchState(store, { loading: false })
                return;
            }
            const order: Order = {
                id: crypto.randomUUID(),
                userId: user.id || '',
                total: Math.round(
                    store.cartItems()
                        .reduce((acc, item) => acc + item.quantity * item.product.price, 0)),
                items: store.cartItems(),
                paymentStatus: 'success'
            }

            await new Promise((resolve) => setTimeout(resolve, 5000));
            patchState(store, { loading: false, cartItems: [] });
            router.navigate(['order-success']);
        }
    }))
);