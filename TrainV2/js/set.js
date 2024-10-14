document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll('.item');
    const leftStaticImage = document.getElementById('leftStaticImage');
    const rightStaticImage = document.getElementById('rightStaticImage');
    const body = document.body;

    const images = {
        desert: {
            id: "desert",
            left: "img/home_page/left_image_desert.jpg",
            right: "img/home_page/right_image_desert.jpg",
            background: "url('img/home_page/desert_background2.jpg')",
            bouton_foret: "img/Desert/sand4.png",
            bouton_eau: "img/Desert/cactus4.png",
            bouton_obstacle_1: "img/Desert/obstacle1.png",
            bouton_rail_horizontal: "img/Desert/rail-horizontal.png",
            bouton_rail_vertical: "img/Desert/rail-vertical.png",
            bouton_rail_droite_vers_haut: "img/Desert/rail-droite-vers-haut.png",
            bouton_rail_haut_vers_droite: "img/Desert/rail-haut-vers-droite.png",
            bouton_rail_droite_vers_bas: "img/Desert/rail-droite-vers-bas.png",
            bouton_rail_bas_vers_droite: "img/Desert/rail-bas-vers-droite.png",
            bouton_train_1: "img/Desert/locomotive.png",
            bouton_train_2: "img/Desert/loco-1-wagon.png",
            bouton_train_4: "img/Desert/loco-3-wagons.png",
            bouton_train_6: "img/Desert/loco-5-wagons.png",
        },
        tropic: {
            id: "tropic",
            left: "img/home_page/left_image_jungle.jpg",
            right: "img/home_page/right_image_jungle.jpg",
            background: "url('img/home_page/tropic_background.jpg')",
            bouton_foret: "img/Jungle/foret2.png",
            bouton_eau: "img/Jungle/eau2.png",
            bouton_obstacle_1: "img/Jungle/obstacle1.png",
            bouton_rail_horizontal: "img/Jungle/rail-horizontal.png",
            bouton_rail_vertical: "img/Jungle/rail-vertical.png",
            bouton_rail_droite_vers_haut: "img/Jungle/rail-droite-vers-haut.png",
            bouton_rail_haut_vers_droite: "img/Jungle/rail-haut-vers-droite.png",
            bouton_rail_droite_vers_bas: "img/Jungle/rail-droite-vers-bas.png",
            bouton_rail_bas_vers_droite: "img/Jungle/rail-bas-vers-droite.png",
            bouton_train_1: "img/Jungle/locomotive.png",
            bouton_train_2: "img/Jungle/loco-1-wagon.png",
            bouton_train_4: "img/Jungle/loco-3-wagons.png",
            bouton_train_6: "img/Jungle/loco-5-wagons.png",
        },
        ice: {
            id: "ice",
            left: "img/home_page/left_image_winter.jpg",
            right: "img/home_page/right_image_winter.jpg",
            background: "url('img/home_page/winter_background2.jpg')",
            bouton_foret: "img/Winter/snow5.png",
            bouton_eau: "img/Winter/ice4.png",
            bouton_obstacle_1: "img/Winter/obstacle1.png",
            bouton_rail_horizontal: "img/Winter/rail-horizontal.png",
            bouton_rail_vertical: "img/Winter/rail-vertical.png",
            bouton_rail_droite_vers_haut: "img/Winter/rail-droite-vers-haut.png",
            bouton_rail_haut_vers_droite: "img/Winter/rail-haut-vers-droite.png",
            bouton_rail_droite_vers_bas: "img/Winter/rail-droite-vers-bas.png",
            bouton_rail_bas_vers_droite: "img/Winter/rail-bas-vers-droite.png",
            bouton_train_1: "img/Winter/locomotive.png",
            bouton_train_2: "img/Winter/loco-1-wagon.png",
            bouton_train_4: "img/Winter/loco-3-wagons.png",
            bouton_train_6: "img/Winter/loco-5-wagons.png",
        },
        default: {
            id: "default",
            left: "img/home_page/train.jpg",
            right: "img/home_page/train2.jpg",
            background: "url('img/home_page/default_background.jpg')",
            bouton_foret: "img/home_page/default_cell.png",
            bouton_eau: "img/Winter/ice4.png",
            bouton_obstacle_1: "img/Winter/obstacle1.png",
            bouton_rail_horizontal: "img/Winter/rail-horizontal.png",
            bouton_rail_vertical: "img/Winter/rail-vertical.png",
            bouton_rail_droite_vers_haut: "img/Winter/rail-droite-vers-haut.png",
            bouton_rail_haut_vers_droite: "img/Winter/rail-haut-vers-droite.png",
            bouton_rail_droite_vers_bas: "img/Winter/rail-droite-vers-bas.png",
            bouton_rail_bas_vers_droite: "img/Winter/rail-bas-vers-droite.png",
            bouton_train_1: "img/Winter/locomotive.png",
            bouton_train_2: "img/Winter/loco-1-wagon.png",
            bouton_train_4: "img/Winter/loco-3-wagons.png",
            bouton_train_6: "img/Winter/loco-5-wagons.png",
        }
    };

    items.forEach(item => {
        item.addEventListener('click', () => {
            const id = item.id;
            const imageSet = images[id];

            leftStaticImage.src = imageSet.left;
            leftStaticImage.alt = "Left Static Image";
            rightStaticImage.src = imageSet.right;
            rightStaticImage.alt = "Right Static Image";
            
            body.style.backgroundImage = imageSet.background;

            document.getElementById('bouton_foret').src = imageSet.bouton_foret;
            document.getElementById('bouton_eau').src = imageSet.bouton_eau;
            document.getElementById('bouton_obstacle_1').src = imageSet.bouton_obstacle_1;
            document.getElementById('bouton_rail_horizontal').src = imageSet.bouton_rail_horizontal;
            document.getElementById('bouton_rail_vertical').src = imageSet.bouton_rail_vertical;
            document.getElementById('bouton_rail_droite_vers_haut').src = imageSet.bouton_rail_droite_vers_haut;
            document.getElementById('bouton_rail_haut_vers_droite').src = imageSet.bouton_rail_haut_vers_droite;
            document.getElementById('bouton_rail_droite_vers_bas').src = imageSet.bouton_rail_droite_vers_bas;
            document.getElementById('bouton_rail_bas_vers_droite').src = imageSet.bouton_rail_bas_vers_droite;
            document.getElementById('bouton_train_1').src = imageSet.bouton_train_1;
            document.getElementById('bouton_train_2').src = imageSet.bouton_train_2;
            document.getElementById('bouton_train_4').src = imageSet.bouton_train_4;
            document.getElementById('bouton_train_6').src = imageSet.bouton_train_6;

            updateTrainImages(imageSet);

        });
    });

    function updateTrainImages(imageSet) {
        updateTrainImagesInTrainJS(imageSet);
    }

    const defaultTheme = images.default;
    body.style.backgroundImage = defaultTheme.background;
    document.getElementById('bouton_foret').src = defaultTheme.bouton_foret;
    document.getElementById('bouton_eau').src = defaultTheme.bouton_eau;
    document.getElementById('bouton_obstacle_1').src = defaultTheme.bouton_obstacle_1;
    document.getElementById('bouton_rail_horizontal').src = defaultTheme.bouton_rail_horizontal;
    document.getElementById('bouton_rail_vertical').src = defaultTheme.bouton_rail_vertical;
    document.getElementById('bouton_rail_droite_vers_haut').src = defaultTheme.bouton_rail_droite_vers_haut;
    document.getElementById('bouton_rail_haut_vers_droite').src = defaultTheme.bouton_rail_haut_vers_droite;
    document.getElementById('bouton_rail_droite_vers_bas').src = defaultTheme.bouton_rail_droite_vers_bas;
    document.getElementById('bouton_rail_bas_vers_droite').src = defaultTheme.bouton_rail_bas_vers_droite;
    document.getElementById('bouton_train_1').src = defaultTheme.bouton_train_1;
    document.getElementById('bouton_train_2').src = defaultTheme.bouton_train_2;
    document.getElementById('bouton_train_4').src = defaultTheme.bouton_train_4;
    document.getElementById('bouton_train_6').src = defaultTheme.bouton_train_6;
    updateTrainImages(defaultTheme);
});