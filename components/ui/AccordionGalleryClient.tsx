import AccordionGallery from "../AccordionGallery";

const items = [
    { image: '/features/preferensi.webp', label: 'Personalisasi Menggunakan AI'},
    { image: '/features/tugas.webp', label: 'AI Buatin Kamu Saran Tugas Belajar Harian'},
    { image: '/features/roadmap.webp', label: 'AI Buatin Kamu Roadmap Belajar'},
    { image: '/features/latihan.webp', label: 'Latihan Syntax Puzzle dari AI'},
    { image: '/features/streak.webp', label: 'Streak Harian'}
];

export default function AccordionGalleryClient() {
    return (
        <AccordionGallery
            items={items}
            defaultIndex={2}
            expandRatio={0.52}
            trigger="hover"
            accentColor="#ffffff"
            overlayColor="#f16634"
            textColor="#ffffff"
            grayscale
            showLabels
            duration={0.6}
            ease="power2.inOut"
            parallax={0.5}
            tilt={6}
            stagger={0.06}
            height={380}
            gap={10}
            radius={16}
            orientation="horizontal"
        />
    )
}