CREATE TABLE Purchase (
	Id INT PRIMARY KEY IDENTITY(1,1),
	Number NVARCHAR(50) NOT NULL,
	Total DECIMAL(18,2) NOT NULL DEFAULT 0,
	SaleDate DATETIME2 NOT NULL DEFAULT GETDATE(),
	CustomerName VARCHAR(50) NULL,
	CustomerContact VARCHAR(50) NULL,
	VendorId INT NOT NULL,
	CreatedAt DATETIME2 DEFAULT GETDATE(),
	CONSTRAINT FK_Vendors_Sales FOREIGN KEY (VendorId) REFERENCES Vendors(Id)
)