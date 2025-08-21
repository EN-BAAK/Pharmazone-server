import { DataTypes, Model } from "sequelize";
import sequelize from "./index";
import { PendingCompanies  as PendingCompaniesType } from "../misc/types";
import bcrypt from "bcryptjs";

class PendingCompanies
  extends Model<PendingCompaniesType>
  implements PendingCompaniesType
{
  public id?: number;
  public email!: string;
  public verificationCode!: string;
  public password!: string;
  public name!: string;
  public phone?: string | null;
  public role!: string;
  public requestType!: string;
}

PendingCompanies.init(
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
    modelName: "PendingCompanies",
    tableName: "PendingCompanies",
    timestamps: false,
    hooks: {
      beforeCreate: async (user) => {
        if (user.verificationCode) {
          const saltRounds = parseInt(process.env.SALT!);
          user.verificationCode = await bcrypt.hash(
            user.verificationCode,
            saltRounds
          );
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("verificationCode")) {
          const saltRounds = parseInt(process.env.SALT!, 10);
          user.verificationCode = await bcrypt.hash(
            user.verificationCode,
            saltRounds
          );
        }
      },
    },
  }
);

export default PendingCompanies;
