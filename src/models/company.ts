import { DataTypes, Model } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "./index";
import { Company as CompanyType } from "../misc/types";
import { decrypt, encrypt } from "../misc/hashing";

class Company extends Model<CompanyType> implements CompanyType {
  public id?: number;
  public name!: string;
  public email!: string;
  public phone?: string | null;
  public password!: string;
  public rate: number = 0;
  public description?: string = "Hi I use Pharmazone";
  public role!: string;
  public debtor?: string = encrypt("0");
  public credit?: string = encrypt("0");
  public avatar?: string;
}

Company.init(
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
      allowNull: false,
    },
    rate: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Hi, I use Pharmazone",
    },
    role: {
      type: DataTypes.ENUM("fac", "pha"),
      allowNull: false,
      defaultValue: "pha",
    },
    debtor: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: encrypt("0"),
      get() {
        const rawValue = this.getDataValue("debtor");
        return rawValue ? decrypt(rawValue.toString()) : 0;
      },
      set(value: string) {
        this.setDataValue("debtor", encrypt(value.toString()));
      },
    },
    credit: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: encrypt("0"),
      get() {
        const rawValue = this.getDataValue("credit");
        return rawValue ? decrypt(rawValue.toString()) : 0;
      },
      set(value: string) {
        this.setDataValue("credit", encrypt(value.toString()));
      },
    },
    avatar: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Company",
    tableName: "Company",
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const saltRounds = parseInt(process.env.SALT!);
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const saltRounds = parseInt(process.env.SALT || "10", 10);
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      },
    },
    indexes: [
      {
        name: "company_name_index",
        fields: ["name"],
      },
    ],
  }
);

export default Company;
