-- ===start Create User Table===
IF DB_ID(N'NewBornDb') IS NULL
BEGIN
    EXEC(N'CREATE DATABASE [NewBornDb]');
END;
GO

USE [NewBornDb];

IF OBJECT_ID(N'dbo.LoginUsers', N'U') IS NOT NULL
   AND OBJECT_ID(N'dbo.[User]', N'U') IS NULL
BEGIN
    EXEC sys.sp_rename N'dbo.LoginUsers', N'User';
END;

IF OBJECT_ID(N'dbo.[User]', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.[User]
    (
        Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_User PRIMARY KEY,
        Username NVARCHAR(100) NOT NULL,
        [Password] NVARCHAR(200) NOT NULL,
        Createdate DATETIME2 NOT NULL CONSTRAINT DF_User_Createdate DEFAULT DATEADD(HOUR, 7, SYSUTCDATETIME()),
        Updatedate DATETIME2 NOT NULL CONSTRAINT DF_User_Updatedate DEFAULT DATEADD(HOUR, 7, SYSUTCDATETIME()),
        Createby NVARCHAR(100) NULL,
        Updateby NVARCHAR(100) NULL,
        Createdateutc DATETIME2 NOT NULL CONSTRAINT DF_User_Createdateutc DEFAULT SYSUTCDATETIME(),
        Updatedateutc DATETIME2 NOT NULL CONSTRAINT DF_User_Updatedateutc DEFAULT SYSUTCDATETIME(),
        CONSTRAINT UQ_User_Username UNIQUE (Username)
    );
END;

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.[User]') AND name COLLATE Latin1_General_100_BIN2 = N'id')
    EXEC sys.sp_rename N'dbo.[User].id', N'Id', N'COLUMN';

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.[User]') AND name COLLATE Latin1_General_100_BIN2 = N'username')
    EXEC sys.sp_rename N'dbo.[User].username', N'Username', N'COLUMN';

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.[User]') AND name COLLATE Latin1_General_100_BIN2 = N'password')
    EXEC sys.sp_rename N'dbo.[User].password', N'Password', N'COLUMN';

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.[User]') AND name COLLATE Latin1_General_100_BIN2 = N'createdate')
    EXEC sys.sp_rename N'dbo.[User].createdate', N'Createdate', N'COLUMN';

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.[User]') AND name COLLATE Latin1_General_100_BIN2 = N'updatedate')
    EXEC sys.sp_rename N'dbo.[User].updatedate', N'Updatedate', N'COLUMN';

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.[User]') AND name COLLATE Latin1_General_100_BIN2 = N'createby')
    EXEC sys.sp_rename N'dbo.[User].createby', N'Createby', N'COLUMN';

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.[User]') AND name COLLATE Latin1_General_100_BIN2 = N'updateby')
    EXEC sys.sp_rename N'dbo.[User].updateby', N'Updateby', N'COLUMN';

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.[User]') AND name COLLATE Latin1_General_100_BIN2 = N'createdateutc')
    EXEC sys.sp_rename N'dbo.[User].createdateutc', N'Createdateutc', N'COLUMN';

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.[User]') AND name COLLATE Latin1_General_100_BIN2 = N'updatedateutc')
    EXEC sys.sp_rename N'dbo.[User].updatedateutc', N'Updatedateutc', N'COLUMN';

IF COL_LENGTH(N'dbo.[User]', N'PasswordHash') IS NOT NULL
   AND COL_LENGTH(N'dbo.[User]', N'Password') IS NULL
BEGIN
    EXEC sys.sp_rename N'dbo.[User].PasswordHash', N'Password', N'COLUMN';
END;

IF COL_LENGTH(N'dbo.[User]', N'Created') IS NOT NULL
   AND COL_LENGTH(N'dbo.[User]', N'Createdate') IS NULL
BEGIN
    EXEC sys.sp_rename N'dbo.[User].Created', N'Createdate', N'COLUMN';
END;

IF COL_LENGTH(N'dbo.[User]', N'CreatedAtUtc') IS NOT NULL
   AND COL_LENGTH(N'dbo.[User]', N'Createdateutc') IS NULL
BEGIN
    EXEC sys.sp_rename N'dbo.[User].CreatedAtUtc', N'Createdateutc', N'COLUMN';
END;

IF COL_LENGTH(N'dbo.[User]', N'Createdate') IS NULL
BEGIN
    ALTER TABLE dbo.[User]
        ADD Createdate DATETIME2 NOT NULL CONSTRAINT DF_User_Createdate DEFAULT DATEADD(HOUR, 7, SYSUTCDATETIME());
END;

IF COL_LENGTH(N'dbo.[User]', N'Updatedate') IS NULL
BEGIN
    ALTER TABLE dbo.[User]
        ADD Updatedate DATETIME2 NOT NULL CONSTRAINT DF_User_Updatedate DEFAULT DATEADD(HOUR, 7, SYSUTCDATETIME());
END;

IF COL_LENGTH(N'dbo.[User]', N'Createby') IS NULL
BEGIN
    ALTER TABLE dbo.[User] ADD Createby NVARCHAR(100) NULL;
END;

IF COL_LENGTH(N'dbo.[User]', N'Updateby') IS NULL
BEGIN
    ALTER TABLE dbo.[User] ADD Updateby NVARCHAR(100) NULL;
END;

IF COL_LENGTH(N'dbo.[User]', N'Createdateutc') IS NULL
BEGIN
    ALTER TABLE dbo.[User]
        ADD Createdateutc DATETIME2 NOT NULL CONSTRAINT DF_User_Createdateutc DEFAULT SYSUTCDATETIME();
END;

IF COL_LENGTH(N'dbo.[User]', N'Updatedateutc') IS NULL
BEGIN
    ALTER TABLE dbo.[User]
        ADD Updatedateutc DATETIME2 NOT NULL CONSTRAINT DF_User_Updatedateutc DEFAULT SYSUTCDATETIME();
END;
-- ===end Create User Table===
