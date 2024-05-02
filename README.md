# LibraryManagementSystem
## Finals of DSA course

### First issue encounter the search
- Q: After the input, it doesn't show the filterd list
  -  Change the parameter of displayBooks function to libraryQueue concat with borrowQueue, that way it can take the filteredBooks parameter in the searchBooks function
- Q: It doesn't show the borrowed books in the search
  - The search function originally only searches in the libraryQueue, which doesn't contain the borrowQueue, so just concat it then search
