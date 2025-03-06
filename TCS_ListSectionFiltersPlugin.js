// Main function to initialise the list section filters

function initialiseListSectionFilters() {

    // Helper function to find the intended list section using the targeting block

    function findListSection() {
        let targetBlock = document.querySelector('#filtered-list-section');
        if (targetBlock) {
            let listSection = targetBlock.closest('section').nextElementSibling;
            return listSection;
        }
    }

    // Helper function to create the filter components and add them to the list section

    function addFilterComponents(listSection) {
        let targetBlock = document.querySelector('#filtered-list-section');
        if (targetBlock) {
            let filterWrapper = document.createElement('div');
            filterWrapper.id = 'list-section-filter-wrapper';
            filterWrapper.classList.add('sqs-block-form');
            // Adding the search bar if it is enabled
            if (targetBlock.getAttribute('data-search-enabled') === 'true') {
                // Creating the search bar and adding its classes/event listener
                let searchBar = document.createElement('input');
                searchBar.type = 'text';
                searchBar.placeholder = 'Search items...';
                searchBar.id = 'list-section-search-bar';
                searchBar.classList.add('FTwKkU7x298MvypxZyde');
                searchBar.addEventListener('input', filterListSection);
                // Creating the search bar wrapper and adding its classes and id
                let searchBarWrapper = document.createElement('div');
                searchBarWrapper.id = "list-section-filters-search-bar-wrapper";
                searchBarWrapper.classList.add('form-item', 'field', 'text');
                // Adding the search bar to the wrapper
                searchBarWrapper.appendChild(searchBar);
                // Creating the form styling div and adding its classes and inner elements
                let formStylings = document.createElement('span');
                formStylings.classList.add('form-input-effects', 'wlcGx2YcoCEPSUK91mkw');
                formStylings.innerHTML = '<span class="form-input-effects-border"></span>';
                // Adding the form styling to the search bar wrapper
                searchBarWrapper.appendChild(formStylings);
                // Adding the search bar wrapper to the filter wrapper
                filterWrapper.appendChild(searchBarWrapper);
            }
            // Adding the category select bar if it is enabled
            if (targetBlock.getAttribute('data-categories-enabled') === 'true') {
                // Creating the categories select bar and adding its classes/event listener
                let selectBar = document.createElement('select');
                selectBar.id = 'list-section-select-bar';
                selectBar.classList.add('XO2ScPLCQmVYnDoVT831');
                selectBar.addEventListener('change', filterListSection);
                // Creating the default option for the select bar
                let defaultOption = document.createElement('option');
                defaultOption.value = 'all';
                defaultOption.innerText = 'All Categories';
                selectBar.appendChild(defaultOption);
                // Creating the category select wrapper and adding its classes and id
                let categoriesWrapper = document.createElement('div');
                categoriesWrapper.id = "list-section-filters-categories-wrapper";
                categoriesWrapper.classList.add('form-item', 'field', 'select');
                // Creating the additional category select inner with its specific class
                let categoriesInner = document.createElement('div');
                categoriesInner.classList.add('VV2B_mgrsAfgCTMCqNKe');
                // Adding the select bar to the category select inner
                categoriesInner.appendChild(selectBar);
                // Adding the category select inner to the category select wrapper
                categoriesWrapper.appendChild(categoriesInner);
                // Creating the form styling div and adding its classes and inner elements
                let formStylings = document.createElement('span');
                formStylings.classList.add('form-input-effects', 'wlcGx2YcoCEPSUK91mkw');
                formStylings.innerHTML = '<span class="form-input-effects-border"></span>';
                // Adding the form styling to the category select wrapper
                categoriesInner.appendChild(formStylings);
                // Adding the category select wrapper to the filter wrapper
                filterWrapper.appendChild(categoriesWrapper);
            }
            // Adding the inset class if required
            listSection.querySelector('.user-items-list').insertBefore(filterWrapper, listSection.querySelector('.user-items-list').firstChild);
            if (listSection.querySelector('ul').getAttribute('data-layout-width') === 'inset') {
                filterWrapper.classList.add('inset');
            }
            // Aligning the components depending on user selection
            let alignment = targetBlock.getAttribute('data-horizontal-alignment');
            switch (alignment) {
                case 'center': {
                    filterWrapper.style.justifyContent = 'center';
                    break;
                }
                case 'right': {
                    filterWrapper.style.justifyContent = 'flex-end';
                    break;
                }
                case 'left': {
                    filterWrapper.style.justifyContent = 'flex-start';
                }
            }
        }
    }

    // Helper function to find the user created categories and add them to a list

    function findCategories(listSection) {
        // Creating the empty category list
        let categories = [];
        // Finding all the list item descriptions
        let listItemDescriptions = listSection.querySelectorAll('.list-item-content__description p');
        // Iterating over the descriptions
        listItemDescriptions.forEach(description => {
            // Finding the category from the description text, looking for the text '#category/'
            let text = description.innerText;
            let categoryMatch = text.match(/#category\/([^\/]*)\//);
            // If a category is found
            if (categoryMatch) {
                // Add the category to a variable
                let category = categoryMatch[1];
                // Add the category to an attribute of the list item
                let listItem = description.closest('.list-item');
                if (listItem) {
                    listItem.setAttribute('data-category', category);
                }
                // Remove the category from the description text
                description.innerText = text.replace(categoryMatch[0], '');
                if (description.innerText.trim() === '') {
                    description.remove();
                }
                // If the category isnt in the list, add it to the category list
                if (!categories.includes(category)) {
                    categories.push(category);
                }
            }
        });
        return categories;
    }

    // Helper function to add the categories to the select bar

    function addCategoryOptions(categories) {
        let selectBar = document.querySelector('#list-section-select-bar');
        if (!selectBar) return;
        categories.forEach(category => {
            let option = document.createElement('option');
            option.value = category;
            option.innerText = category;
            selectBar.appendChild(option);
        });
    }

    // Event listener function to filter the section based on the search bar and/or select bar

    function filterListSection() {
        let listSection = findListSection();
        let searchBar = document.querySelector('#list-section-search-bar');
        let selectBar = document.querySelector('#list-section-select-bar');

        // Finding the values of the search and category bars
        let searchQuery = searchBar ? searchBar.value.toLowerCase() : '';
        let categoryQuery = selectBar ? selectBar.value : 'all';

        let listItems = listSection.querySelectorAll('.list-item');

        // Iterating over the list items and hiding them if they dont match the search criteria
        listItems.forEach(item => {
            let itemName = item.querySelector('.list-item-content__title').innerText.toLowerCase();
            let itemDescription = item.querySelector('.list-item-content__description').innerText.toLowerCase();
            let itemCategory = item.getAttribute('data-category');

            const matchesSearch = searchBar ? (itemName.includes(searchQuery) || itemDescription.includes(searchQuery)) : true;
            const matchesCategory = selectBar ? (categoryQuery === 'all' || itemCategory === categoryQuery) : true;

            if (matchesSearch && matchesCategory) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

     // Running all the functions in the right order 
     
    let listSection = findListSection();
    let categories = findCategories(listSection);
    addFilterComponents(listSection);
    addCategoryOptions(categories);
}

document.addEventListener('DOMContentLoaded', initialiseListSectionFilters);