import { create } from 'zustand';

interface FormState {
    id: number;
    name: string;
    price: number;
    cost: number;
    imageURL: string;
}

interface FormStore extends FormState {
    setId: (id: number) => void;
    setName: (name: string) => void;
    setPrice: (price: number) => void;
    setCost: (cost: number) => void;
    setImageURL: (imageUrl: string) => void;
}

const useFormStore = create<FormStore>((set) => ({
    id: 0,
    name: '',
    price: 0,
    cost: 0,
    imageURL: '',
    setId: (id) => set({ id}),
    setName: (name) => set({ name }),
    setPrice: (price) => set({ price }),
    setCost: (cost) => set({ cost }),
    setImageURL: (imageURL) => {
        set({ imageURL });
        localStorage.setItem('url-img', imageURL);
    },
}));

export default useFormStore;
