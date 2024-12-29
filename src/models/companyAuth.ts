import { DataTypes, Model } from "sequelize";
import sequelize from "./index";
import { CompanyAuth as CompanyAuthType } from "../misc/types";

class CompanyAuth extends Model<CompanyAuthType> implements CompanyAuthType {
  public id?: number;
  public email!: string;
  public verificationCode!: string;
  public password!: string;
  public name!: string;
  public phone?: string | null;
  public role!: string;
  public requestType!: string;
}

CompanyAuth.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("fac", "pha"),
      allowNull: true,
    },
    verificationCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requestType: {
      type: DataTypes.ENUM("register", "verify"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "CompanyAuth",
    tableName: "CompanyAuth",
    timestamps: true,
  }
);

export default CompanyAuth;
