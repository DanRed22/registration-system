# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts
Running the client website:
> run: npm run start
This command shall be executed at the root directory of the project.

Running the server:
> go to: cd src/api
> run: npm run start
This will start the server (Back End).

## Known Bugs
1. Upon Exporting the PDF contents may be cropped due to overflowing of page contents, to resolve this just adjust the "itemsPerPage" variable in the ViewTable.js to adjust the number of rows per page.
2. Upon exporting it only exports a max of n times thus, change the "paginatedData.map" variable to "data.map" variable.

