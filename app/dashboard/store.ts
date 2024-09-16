import { create } from 'zustand';

interface FormState {
    name: string;
    price: number;
    cost: number;
    imageURL: string;
}

interface FormStore extends FormState {
    setName: (name: string) => void;
    setPrice: (price: number) => void;
    setCost: (cost: number) => void;
    setImageURL: (imageUrl: string) => void;
}

const useFormStore = create<FormStore>((set) => ({
    name: '',
    price: 0,
    cost: 0,
    imageURL: '',
    setName: (name) => set({ name }),
    setPrice: (price) => set({ price }),
    setCost: (cost) => set({ cost }),
    setImageURL: (imageURL) => {
        set({ imageURL });
        localStorage.setItem('url-img', imageURL);
    },
}));

export default useFormStore;
