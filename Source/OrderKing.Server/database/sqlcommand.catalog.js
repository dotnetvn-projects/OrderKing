var defineProperty = function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
};

//create new category
defineProperty('createCategory', `
    INSERT INTO Category(StoreId, Name, CreatedDate)
    VALUES (@StoreId, @Name, @CreatedDate);
    SELECT SCOPE_IDENTITY() AS CategoryId
`);

//update category
defineProperty('updateCategory', `
    UPDATE Category
    SET Name = @Name,
    StoreId = @StoreId,
    IsActived = @IsActived
    WHERE Id = @Id
`);

//delete category
defineProperty('deactivateCategory', `
    UPDATE Category
    SET IsActived = 0
    WHERE Id = @Id
`);