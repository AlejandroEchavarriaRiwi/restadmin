import { create } from 'zustand';

interface FormState {
    name: string;
    price: number;
    cost: number;
    imageUrl: string;
}

interface FormStore extends FormState {
    setName: (name: string) => void;
    setPrice: (price: number) => void;
    setCost: (cost: number) => void;
    setImageUrl: (imageUrl: string) => void;
}

const useFormStore = create<FormStore>((set) => ({
    name: '',
    price: 0,
    cost: 0,
    imageUrl: '',
    setName: (name) => set({ name }),
    setPrice: (price) => set({ price }),
    setCost: (cost) => set({ cost }),
    setImageUrl: (imageUrl) => {
        set({ imageUrl });
        localStorage.setItem('url-img', imageUrl);
    },
}));

export default useFormStore;
