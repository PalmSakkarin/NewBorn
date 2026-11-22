-- ===start Create LoginUsers Table===
IF DB_ID(N'NewBornDb') IS NULL
BEGIN
    EXEC(N'CREATE DATABASE [NewBornDb]');
END;
GO

USE [NewBornDb];

IF OBJECT_ID(N'dbo.LoginUsers', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.LoginUsers
    (
        Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_LoginUsers PRIMARY KEY,
        Username NVARCHAR(100) NOT NULL,
        [Password] NVARCHAR(200) NOT NULL,
        Created DATETIME2 NOT NULL CONSTRAINT DF_LoginUsers_Created DEFAULT DATEADD(HOUR, 7, SYSUTCDATETIME()),
        CONSTRAINT UQ_LoginUsers_Username UNIQUE (Username)
    );
END;

IF COL_LENGTH(N'dbo.LoginUsers', N'PasswordHash') IS NOT NULL
   AND COL_LENGTH(N'dbo.LoginUsers', N'Password') IS NULL
BEGIN
    EXEC sp_rename N'dbo.LoginUsers.PasswordHash', N'Password', N'COLUMN';
END;

IF COL_LENGTH(N'dbo.LoginUsers', N'CreatedAtUtc') IS NOT NULL
   AND COL_LENGTH(N'dbo.LoginUsers', N'Created') IS NULL
BEGIN
    EXEC sp_rename N'dbo.LoginUsers.CreatedAtUtc', N'Created', N'COLUMN';
END;

DECLARE @createdDefaultConstraint sysname;
SELECT @createdDefaultConstraint = dc.name
FROM sys.default_constraints dc
INNER JOIN sys.columns c ON c.default_object_id = dc.object_id
WHERE dc.parent_object_id = OBJECT_ID(N'dbo.LoginUsers')
  AND c.name = N'Created';

IF @createdDefaultConstraint IS NOT NULL
BEGIN
    DECLARE @dropConstraintSql nvarchar(4000);
    SET @dropConstraintSql = N'ALTER TABLE dbo.LoginUsers DROP CONSTRAINT ' + QUOTENAME(@createdDefaultConstraint);
    EXEC sys.sp_executesql @dropConstraintSql;
END;

ALTER TABLE dbo.LoginUsers
    ADD CONSTRAINT DF_LoginUsers_Created DEFAULT DATEADD(HOUR, 7, SYSUTCDATETIME()) FOR Created;
-- ===end Create LoginUsers Table===
