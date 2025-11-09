// Загрузка элементов DOM
const imageInput = document.getElementById('imageInput');
const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.getElementById('closeModal');

// Анимации и цвета фона
const backgrounds = [
    { class: 'animated-bg-1', colors: ['#ff9a9e', '#fad0c4', '#ffecd2', '#f3c4fb'] },
    { class: 'animated-bg-2', colors: ['#f3c4fb', '#ff9a9e', '#fad0c4', '#f1e1a6'] },
    { class: 'animated-bg-3', colors: ['#ff9a9e', '#f3c4fb', '#a8d5e2', '#fad0c4'] }
];

// Функция для случайного выбора анимации фона
function changeBackground() {
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    document.body.className = randomBg.class;
    console.log('Background changed to:', randomBg.class); // Логирование смены фона
}

// Переключение фона каждые 10 секунд
setInterval(changeBackground, 10000);
changeBackground(); // Запуск сразу

// Загрузка сохраненных изображений из localStorage
function loadSavedImages() {
    const savedImages = JSON.parse(localStorage.getItem('galleryImages')) || [];
    console.log('Loaded images from localStorage:', savedImages.length); // Логирование
    savedImages.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.dataset.index = index;
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
        imageContainer.appendChild(img);
        addImageEvents(imageContainer, src, index);
        gallery.appendChild(imageContainer);

        setTimeout(() => {
            img.style.opacity = '1';
        }, 100);
    });
}

// Сохранение изображения в localStorage
function saveImage(src) {
    const savedImages = JSON.parse(localStorage.getItem('galleryImages')) || [];
    savedImages.push(src);
    localStorage.setItem('galleryImages', JSON.stringify(savedImages));
    console.log('Image saved to localStorage, total:', savedImages.length); // Логирование
    return savedImages.length - 1; // Возвращаем индекс нового изображения
}

// Удаление изображения из localStorage и галереи
function deleteImage(index, container) {
    let savedImages = JSON.parse(localStorage.getItem('galleryImages')) || [];
    savedImages = savedImages.filter((_, i) => i !== index);
    localStorage.setItem('galleryImages', JSON.stringify(savedImages));
    container.remove();
    console.log('Image deleted, new total:', savedImages.length); // Логирование
    // Обновляем индексы оставшихся изображений
    Array.from(gallery.querySelectorAll('.image-container img')).forEach((img, i) => {
        img.dataset.index = i;
    });
}

// Обработка событий для изображения (клик и правый клик)
function addImageEvents(container, src, index) {
    // Клик для увеличения
    container.addEventListener('click', () => {
        modalImage.src = src;
        modal.style.display = 'flex';
        console.log('Opened modal for image:', src); // Логирование
    });

    // Правый клик для удаления
    container.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (confirm('Удалить это воспоминание?')) {
            deleteImage(index, container);
        }
    });
}

// Загрузка новых изображений
imageInput.addEventListener('change', function(event) {
    const files = event.target.files;
    console.log('Files selected:', files.length);

    if (!files || files.length === 0) return;

    for (let file of files) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const src = e.target.result;
                const img = document.createElement('img');
                img.src = src;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease';

                const index = saveImage(src);
                img.dataset.index = index;

                const imageContainer = document.createElement('div');
                imageContainer.classList.add('image-container');
                imageContainer.appendChild(img);
                addImageEvents(imageContainer, src, index);

                // Добавляем в конец — порядок сохраняется
                gallery.appendChild(imageContainer);

                setTimeout(() => {
                    img.style.opacity = '1';
                }, 100);
            };
            reader.readAsDataURL(file);
        }
    }
});

// Закрытие модального окна
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    console.log('Modal closed'); // Логирование
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        console.log('Modal closed by clicking outside'); // Логирование
    }
});

// Загрузка сохраненных изображений при открытии страницы
loadSavedImages();
