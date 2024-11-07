import { DataTypes, Model } from "sequelize";
import sequelize from "./index";
import { NewCompany as NewCompanyType, Role as RoleType } from "../misc/types";

class NewCompany extends Model<NewCompanyType> implements NewCompanyType {
  public id!: number;
  public email!: string;
  public verificationCode!: string;
  public password!: string;
  public name!: string;
  public phone!: string;
  public role!: RoleType;
  public requestType!: "register" | "verify";
}

NewCompany.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    verificationCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("fac", "pha"),
      allowNull: true,
    },
    requestType: {
      type: DataTypes.ENUM("register", "verify"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "NewCompany",
    tableName: "NewCompany",
    timestamps: true,
  }
);

export default NewCompany;
