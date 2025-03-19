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
                searchBar.addEventListener('input', filterListSection);
                // Creating the search bar wrapper and adding its classes and id
                let searchBarWrapper = document.createElement('div');
                searchBarWrapper.id = "list-section-filters-search-bar-wrapper";
                searchBarWrapper.classList.add('form-item', 'field', 'text');
                // Adding the search bar to the wrapper
                searchBarWrapper.appendChild(searchBar);
                // Creating the form styling div and adding its classes and inner elements
                let formStylings = document.createElement('span');
                formStylings.classList.add('form-input-effects');
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
                // Adding the category select inner to the category select wrapper
                categoriesWrapper.appendChild(selectBar);
                // Creating the dropdown icon and adding it to the category select wrapper
                let dropdownIcon = document.createElement('div');
                dropdownIcon.classList.add('select-dropdown-icon');
                dropdownIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="12"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.439453 1.49825L1.56057 0.501709L9.00001 8.87108L16.4395 0.501709L17.5606 1.49825L9.00001 11.1289L0.439453 1.49825Z"></path></svg>';
                categoriesWrapper.appendChild(dropdownIcon);
                // Creating the form styling div and adding its classes and inner elements
                let formStylings = document.createElement('span');
                formStylings.classList.add('form-input-effects');
                formStylings.innerHTML = '<span class="form-input-effects-border"></span>';
                // Adding the form styling to the category select wrapper
                categoriesWrapper.appendChild(formStylings);
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
            let spacing = targetBlock.getAttribute('data-bottom-margin');
            filterWrapper.style.marginBottom = spacing;
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
            let categoryMatches = text.match(/#category\/([^\/]*)\//g);
            // If a category is found
            if (categoryMatches) {
                let listItem = description.closest('.list-item');
                if (listItem) {
                    // Extract category names and assign them as a comma-separated list
                    let categoryList = categoryMatches.map(match => match.match(/#category\/([^\/]*)\//)[1]);
                    
                    // Get existing categories from the data-category attribute
                    let existingCategories = listItem.getAttribute('data-category');
                    let existingCategoryList = existingCategories ? existingCategories.split(',') : [];
    
                    // Combine existing categories with the new ones, avoiding duplicates
                    let combinedCategories = [...new Set([...existingCategoryList, ...categoryList])];
    
                    // Update the data-category attribute
                    listItem.setAttribute('data-category', combinedCategories.join(','));
    
                    // Add the '.list-item-categories' element to display categories
                    let textWrapper = listItem.querySelector('.list-item-content__text-wrapper');
                    if (textWrapper) {
                        // Remove existing categories container if it exists
                        let existingCategoriesContainer = textWrapper.querySelector('.list-item-categories');
                        if (existingCategoriesContainer) {
                            existingCategoriesContainer.remove();
                        }
    
                        // Create the categories container
                        let categoriesContainer = document.createElement('div');
                        categoriesContainer.classList.add('list-item-categories');
    
                        // Add individual category elements
                        combinedCategories.forEach(category => {
                            let categoryElement = document.createElement('span');
                            categoryElement.classList.add('list-item-category');
                            categoryElement.innerText = category;
                            categoriesContainer.appendChild(categoryElement);
                        });
    
                        // Add the categories container as the first child of the text wrapper
                        textWrapper.insertBefore(categoriesContainer, textWrapper.firstChild);
                    }
    
                    listItem.classList.add('visible');
                }
    
                // Remove all category tags from the description text
                description.innerText = text.replace(/#category\/([^\/]*)\//g, '');
                if (description.innerText.trim() === '') {
                    description.remove();
                }
    
                // Add unique categories to the categories array
                categoryMatches.forEach(match => {
                    let category = match.match(/#category\/([^\/]*)\//)[1];
                    if (!categories.includes(category)) {
                        categories.push(category);
                    }
                });
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
            let itemCategories = item.getAttribute('data-category') ? item.getAttribute('data-category').split(',') : [];

            // Check if the search query matches the name, description, or any category
            const matchesSearch = searchBar ? (
            itemName.includes(searchQuery) ||
            itemDescription.includes(searchQuery) ||
            itemCategories.some(category => category.toLowerCase().includes(searchQuery))
            ) : true;

            // Check if the item matches the selected category
            const matchesCategory = selectBar ? (categoryQuery === 'all' || itemCategories.includes(categoryQuery)) : true;

            item.classList.remove('visible');
            setTimeout(() => {
                item.classList.add('hidden');
            }, 250);
            
            setTimeout(() => {
                if (matchesSearch && matchesCategory) {
                    item.classList.remove('hidden');
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, 10);
                }
            }, 250);
        });
    }

     // Running all the functions in the right order 
     
    let listSection = findListSection();
    let categories = findCategories(listSection);
    addFilterComponents(listSection);
    addCategoryOptions(categories);
}

document.addEventListener('DOMContentLoaded', initialiseListSectionFilters);