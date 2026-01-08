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
import { AddReviewParams, UserReview } from "./models/user-review";

export type EcommerceState = {
    products: Product[];
    category: string;
    wishlistItems: Product[];
    cartItems: CartItem[];
    user: User | undefined;
    loading: boolean;
    selectedProductId: string | undefined;
    writeReview:boolean;
};

export const EcommerceStore = signalStore(
    {
        providedIn: 'root'
    },
    withState({
        products: [
            {
                id: 'p1', name: 'Classic Tee', description: '100% cotton unisex t-shirt', price: 19.99, imageUrl: 'pexels-photo-8148576.png', rating: 4.5, reviewCount: 120, inStock: true, category: 'apparel',
                reviews: [{
                    id: '1', productId: 'p1', userName: 'John Doe', userImageUrl: 'https://randomuser.me/api/portraits/men/42.jpg', rating: 5,
                    title: 'Great T-Shirt', comment: 'Great quality t-shirt, very comfortable to wear.',
                    reviewDate: new Date('2024-01-15')
                }, {
                    id: '2', productId: 'p1', userName: 'Alice Cooper', userImageUrl: 'https://randomuser.me/api/portraits/women/42.jpg', rating: 4,
                    title: 'Amazing T-Shirt', comment: 'I love this t-shirt, fits perfectly and feels great on skin.',
                    reviewDate: new Date('2024-01-12')
                }, {
                    id: '3', productId: 'p1', userName: 'Tom Henry', userImageUrl: 'https://randomuser.me/api/portraits/men/44.jpg', rating: 4.5,
                    title: 'Value price for product', comment: 'Great price for a quality t-shirt.',
                    reviewDate: new Date('2024-01-12')
                }]
            },
            {
                id: 'p2', name: 'Running Sneakers', description: 'Lightweight running shoes', price: 79.99, imageUrl: 'pexels-photo-19577864.png', rating: 4.7, reviewCount: 89, inStock: false, category: 'footwear',
                reviews: [{
                    id: '2', productId: 'p2', userName: 'Jane Smith', userImageUrl: 'https://randomuser.me/api/portraits/women/63.jpg', rating: 5,
                    title: 'Excellent Running Shoes', comment: 'Very comfortable and lightweight, great for running.',
                    reviewDate: new Date('2024-01-20')
                }]
            },
            {
                id: 'p3', name: 'Bluetooth Headphones', description: 'Noise-cancelling over-ear headphones', price: 129.99, imageUrl: 'pexels-photo-5269759.png', rating: 4.3, reviewCount: 42, inStock: true, category: 'electronics',
                reviews: [{
                    id: '3', productId: 'p3', userName: 'Mike Johnson', userImageUrl: 'https://randomuser.me/api/portraits/men/62.jpg', rating: 4,
                    title: 'Good Sound Quality', comment: 'Great noise cancellation and sound quality.',
                    reviewDate: new Date('2024-01-18')
                }]
            },
            {
                id: 'p4', name: 'Denim Jacket', description: 'Classic blue denim jacket', price: 59.99, imageUrl: 'pexels-photo-1105058.png', rating: 4.2, reviewCount: 34, inStock: true, category: 'apparel',
                reviews: [{
                    id: '4', productId: 'p4', userName: 'Sarah Williams', userImageUrl: 'https://randomuser.me/api/portraits/women/50.jpg', rating: 4,
                    title: 'Stylish and Durable', comment: 'Classic design and very durable jacket.',
                    reviewDate: new Date('2024-01-17')
                }]
            },
            {
                id: 'p5', name: 'Stainless Kettle', description: '1.7L electric kettle', price: 39.99, imageUrl: 'pexels-photo-6933130.png', rating: 4.1, reviewCount: 18, inStock: true, category: 'kitchen',
                reviews: [{
                    id: '5', productId: 'p5', userName: 'David Brown', userImageUrl: 'pexels-photo-5678901.png', rating: 4,
                    title: 'Heats Water Quickly', comment: 'Heats water very quickly and efficiently.',
                    reviewDate: new Date('2024-01-16')
                }]
            },
            {
                id: 'p6', name: 'Yoga Mat', description: 'Non-slip fitness mat', price: 25.00, imageUrl: 'pexels-photo-4327014.png', rating: 4.6, reviewCount: 76, inStock: false, category: 'sports',
                reviews: [{
                    id: '6', productId: 'p6', userName: 'Emily Davis', userImageUrl: 'https://randomuser.me/api/portraits/women/84.jpg', rating: 5,
                    title: 'Perfect for Yoga', comment: 'Non-slip surface and very comfortable for yoga.',
                    reviewDate: new Date('2024-01-14')
                }]
            },
            {
                id: 'p7', name: 'Smart Watch', description: 'Heart-rate and activity tracking', price: 199.99, imageUrl: 'pexels-photo-437037.png', rating: 4.4, reviewCount: 210, inStock: false, category: 'electronics', 
                reviews: [{
                    id: '7', productId: 'p7', userName: 'Robert Taylor', userImageUrl: 'https://randomuser.me/api/portraits/men/89.jpg', rating: 4,
                    title: 'Great Fitness Tracker', comment: 'Accurate heart-rate tracking and great battery life.',
                    reviewDate: new Date('2024-01-13')
                }]
            },
            {
                id: 'p8', name: 'Leather Wallet', description: 'Slim bifold wallet', price: 29.99, imageUrl: 'pexels-photo-915915.png', rating: 4.0, reviewCount: 12, inStock: true, category: 'accessories', 
                reviews: [{
                    id: '8', productId: 'p8', userName: 'Lisa Anderson', userImageUrl: 'https://randomuser.me/api/portraits/women/64.jpg', rating: 4,
                    title: 'Quality Leather', comment: 'Good quality leather and slim design.',
                    reviewDate: new Date('2024-01-12')
                }]
            },
            {
                id: 'p9', name: 'Coffee Grinder', description: 'Manual burr grinder', price: 45.00, imageUrl: 'pexels-photo-1309778.png', rating: 4.5, reviewCount: 53, inStock: true, category: 'kitchen', 
                reviews: [{
                    id: '9', productId: 'p9', userName: 'James Wilson', userImageUrl: 'https://randomuser.me/api/portraits/women/14.jpg', rating: 5,
                    title: 'Great Coffee Grinder', comment: 'Produces consistent grind, perfect for coffee lovers.',
                    reviewDate: new Date('2024-01-11')
                }]
            },
            {
                id: 'p10', name: 'Sunglasses', description: 'Polarized UV protection', price: 49.99, imageUrl: 'pexels-photo-5333043.png', rating: 4.3, reviewCount: 98, inStock: true, category: 'accessories', 
                reviews: [{
                    id: '10', productId: 'p10', userName: 'Patricia Moore', userImageUrl: 'https://randomuser.me/api/portraits/men/88.jpg', rating: 4,
                    title: 'Excellent UV Protection', comment: 'Great polarized lenses and stylish design.',
                    reviewDate: new Date('2024-01-10')
                }]
            },
            {
                id: 'p11', name: 'Backpack', description: 'Water-resistant travel backpack', price: 69.99, imageUrl: 'pexels-photo-842947.png', rating: 4.6, reviewCount: 159, inStock: true, category: 'bags', 
                reviews: [{
                    id: '11', productId: 'p11', userName: 'Christopher Lee', userImageUrl: 'https://randomuser.me/api/portraits/men/21.jpg', rating: 5,
                    title: 'Perfect Travel Backpack', comment: 'Water-resistant and spacious, great for travel.',
                    reviewDate: new Date('2024-01-09')
                }]
            },
            {
                id: 'p12', name: 'Desk Lamp', description: 'LED adjustable desk lamp', price: 22.50, imageUrl: 'pexels-photo-1112598.png', rating: 4.2, reviewCount: 27, inStock: true, category: 'home', 
                reviews: [{
                    id: '12', productId: 'p12', userName: 'Barbara Harris', userImageUrl: 'https://randomuser.me/api/portraits/women/24.jpg', rating: 4,
                    title: 'Bright and Adjustable', comment: 'Great LED brightness and easy to adjust.',
                    reviewDate: new Date('2024-01-08')
                }]
            },
            {
                id: 'p13', name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', price: 24.99, imageUrl: 'pexels-photo-392018.png', rating: 4.1, reviewCount: 66, inStock: true, category: 'electronics', 
                reviews: [{
                    id: '13', productId: 'p13', userName: 'Mark White', userImageUrl: 'https://randomuser.me/api/portraits/men/51.jpg', rating: 4,
                    title: 'Ergonomic and Reliable', comment: 'Very ergonomic and reliable wireless mouse.',
                    reviewDate: new Date('2024-01-07')
                }]
            },
            {
                id: 'p14', name: 'Water Bottle', description: 'Insulated stainless steel bottle', price: 19.99, imageUrl: 'pexels-photo-3766180.png', rating: 4.4, reviewCount: 44, inStock: true, category: 'accessories', 
                reviews: [{
                    id: '14', productId: 'p14', userName: 'Jennifer Martin', userImageUrl: 'https://randomuser.me/api/portraits/women/68.jpg', rating: 4,
                    title: 'Keeps Drinks Cold', comment: 'Excellent insulation, keeps drinks cold for hours.',
                    reviewDate: new Date('2024-01-06')
                }]
            },
            {
                id: 'p15', name: 'Beanie', description: 'Warm knit beanie', price: 14.99, imageUrl: 'pexels-photo-375880.png', rating: 4.2, reviewCount: 22, inStock: true, category: 'apparel', 
                reviews: [{
                    id: '15', productId: 'p15', userName: 'Daniel Garcia', userImageUrl: 'https://randomuser.me/api/portraits/men/4.jpg', rating: 4,
                    title: 'Warm and Cozy', comment: 'Warm and cozy beanie, perfect for winter.',
                    reviewDate: new Date('2024-01-05')
                }]
            },
            {
                id: 'p16', name: 'Electric Toothbrush', description: 'Rechargeable sonic toothbrush', price: 39.99, imageUrl: 'pexels-photo-8823972.png', rating: 4.3, reviewCount: 49, inStock: true, category: 'personal care', 
                reviews: [{
                    id: '16', productId: 'p16', userName: 'Karen Rodriguez', userImageUrl: 'https://randomuser.me/api/portraits/women/82.jpg', rating: 4,
                    title: 'Excellent Cleaning Power', comment: 'Great cleaning power and rechargeable.',
                    reviewDate: new Date('2024-01-04')
                }]
            },
            {
                id: 'p17', name: 'Portable Charger', description: '10000mAh power bank', price: 29.99, imageUrl: 'pexels-photo-19810744.png', rating: 4.5, reviewCount: 88, inStock: true, category: 'electronics', 
                reviews: [{
                    id: '17', productId: 'p17', userName: 'Steven Martinez', userImageUrl: 'https://randomuser.me/api/portraits/men/48.jpg', rating: 5,
                    title: 'Fast Charging Power Bank', comment: 'Fast charging and reliable power bank.',
                    reviewDate: new Date('2024-01-03')
                }]
            },
            {
                id: 'p18', name: 'Kitchen Knife Set', description: '3-piece stainless steel knives', price: 34.99, imageUrl: 'pexels-photo-18977916.png', rating: 4.0, reviewCount: 31, inStock: true, category: 'kitchen', 
                reviews: [{
                    id: '18', productId: 'p18', userName: 'Nancy Garcia', userImageUrl: 'https://randomuser.me/api/portraits/women/41.jpg', rating: 4,
                    title: 'Sharp and Durable', comment: 'Sharp stainless steel knives, very durable.',
                    reviewDate: new Date('2024-01-02')
                }]
            },
            {
                id: 'p19', name: 'Ylanite Koppens', description: 'Soft and clean knitted', price: 49.99, imageUrl: 'pexels-photo-934070.png', rating: 4.1, reviewCount: 75, inStock: true, category: 'clothing', 
                reviews: [{
                    id: '19', productId: 'p19', userName: 'Paul Thomas', userImageUrl: 'https://randomuser.me/api/portraits/men/41.jpg', rating: 4,
                    title: 'Soft and Comfortable', comment: 'Very soft and comfortable knitted clothing.',
                    reviewDate: new Date('2024-01-01')
                }]
            },
            {
                id: 'p20', name: 'Koroloa G', description: 'Soft and clean knitted', price: 59.99, imageUrl: 'pexels-photo-4495705.png', rating: 4.2, reviewCount: 75, inStock: false, category: 'clothing', 
                reviews: [{
                    id: '20', productId: 'p20', userName: 'Linda Jackson', userImageUrl: 'https://randomuser.me/api/portraits/women/7.jpg', rating: 4,
                    title: 'Quality Knitted Wear', comment: 'Good quality and clean knitted fabric.',
                    reviewDate: new Date('2023-12-31')
                }]
            },
            {
                id: 'p21', name: 'Kal Pliger', description: 'Soft and clean knitted', price: 69.99, imageUrl: 'pexels-photo-996329.png', rating: 4.3, reviewCount: 75, inStock: true, category: 'clothing', 
                reviews: [{
                    id: '21', productId: 'p21', userName: 'Ronald White', userImageUrl: 'https://randomuser.me/api/portraits/men/73.jpg', rating: 4,
                    title: 'Excellent Material', comment: 'Excellent material and soft knitted design.',
                    reviewDate: new Date('2023-12-30')
                }]
            },
            {
                id: 'p22', name: 'Dom J', description: 'Soft and clean knitted', price: 79.99, imageUrl: 'pexels-photo-45982.png', rating: 4.4, reviewCount: 75, inStock: true, category: 'clothing', 
                reviews: [{
                    id: '22', productId: 'p22', userName: 'Susan Harris', userImageUrl: 'https://randomuser.me/api/portraits/women/20.jpg', rating: 5,
                    title: 'Premium Knitted Clothing', comment: 'Premium quality and very soft knitted material.',
                    reviewDate: new Date('2023-12-29')
                }]
            },
            {
                id: 'p23', name: 'Laptop Sleeve', description: 'Protective 13-inch sleeve', price: 21.99, imageUrl: 'pexels-photo-89723.png', rating: 4.2, reviewCount: 20, inStock: true, category: 'bags', 
                reviews: [{
                    id: '23', productId: 'p23', userName: 'Joseph Taylor', userImageUrl: 'https://randomuser.me/api/portraits/men/52.jpg', rating: 4,
                    title: 'Great Protection', comment: 'Provides great protection for laptops.',
                    reviewDate: new Date('2023-12-28')
                }]
            }
        ],
        category: 'all',
        wishlistItems: [],
        cartItems: [],
        user: undefined,
        loading: false,
        selectedProductId: undefined,
        writeReview:false
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
        },
        showWriteReview:()=>{
            patchState(store,{writeReview:true});
        },
        hideWriteReview:()=>{
            patchState(store,{writeReview:false});
        },
        addReview: async ({title, comment, rating}:AddReviewParams) => {
            patchState(store, { loading: true });
            const product = store.products().find(p => p.id === store.selectedProductId());
            if (!product) {
                patchState(store, { loading: false })
                return;
            }
            const review:UserReview = {
                id: crypto.randomUUID(),
                title,
                comment,
                rating,
                productId: product.id,
                userName: store.user()?.name || 'Anonymous',
                userImageUrl: store.user()?.imageUrl || '',
                reviewDate: new Date()
            };
           const updatedProducts = produce(store.products(), (draft) => {
                const index = draft.findIndex(p => p.id === product.id);
                draft[index].reviews.push(review);
                draft[index].rating = Math.round(
                    (draft[index].reviews.reduce((acc, r) => acc + r.rating, 0) / draft[index].reviews.length) * 10) / 10;
                draft[index].reviewCount = draft[index].reviews.length;
            });
            await new Promise((resolve) => setTimeout(resolve, 2000));
            patchState(store, { products: updatedProducts, loading: false, writeReview:false });
        }
    }))
);