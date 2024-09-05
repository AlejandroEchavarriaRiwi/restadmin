import { create } from 'zustand';

interface FormState {
    name: string;
    price: string;
    cost: string
    imageUrl: string;
}

interface FormStore extends FormState {
    setName: (name: string) => void;
    setPrice: (price: string) => void;
    setCost: (cost: string) => void;
    setImageUrl: (imageUrl: string) => void;
}

const useFormStore = create<FormStore>((set) => ({
    name: '',
    price: '',
    cost: '',
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
