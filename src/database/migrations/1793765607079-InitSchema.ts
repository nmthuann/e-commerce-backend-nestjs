import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1793765607079 implements MigrationInterface {
    name = 'InitSchema1793765607079'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "positions" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "code" character varying(30) NOT NULL, "name" character varying(100) NOT NULL, "description" text, CONSTRAINT "UQ_e21258bdc3692b44960c623940f" UNIQUE ("code"), CONSTRAINT "PK_17e4e62ccd5749b289ae3fae6f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employees" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "salary" numeric(14,2) NOT NULL DEFAULT '0', "hired_at" date NOT NULL DEFAULT ('now'::text)::date, "is_active" boolean NOT NULL DEFAULT true, "user_id" uuid NOT NULL, "position_id" integer NOT NULL, CONSTRAINT "REL_2d83c53c3e553a48dadb9722e3" UNIQUE ("user_id"), CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "password_hash" character varying(255) NOT NULL, "full_name" character varying(100) NOT NULL, "phone" character varying(15), "avatar_url" character varying(255), "role" character varying(20) NOT NULL DEFAULT 'CUSTOMER', "status" character varying(20) NOT NULL DEFAULT 'ACTIVE', "refresh_token_hash" character varying(64), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "category_name" character varying(50) NOT NULL, "category_url" character varying(255) NOT NULL, "description" text, CONSTRAINT "UQ_427858988087490286844dde08a" UNIQUE ("category_url"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "brands" ("id" SERIAL NOT NULL, "brand_name" character varying(50) NOT NULL, "brand_url" character varying(255) NOT NULL, "description" text, "brand_abbreviation" character varying(10) NOT NULL, CONSTRAINT "UQ_35be08736e06a8462e65a9ee7ca" UNIQUE ("brand_name"), CONSTRAINT "UQ_4364fc30681836912bb7e5b8a24" UNIQUE ("brand_url"), CONSTRAINT "UQ_47503ba1414c24799f17c54c248" UNIQUE ("brand_abbreviation"), CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "product_name" character varying(255) NOT NULL, "slug" character varying(100) NOT NULL, "product_line" character varying(100) NOT NULL, "description" text, "status" boolean NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, "priority_sort" integer NOT NULL DEFAULT '0', "product_specs" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "category_id" integer, "brand_id" integer, CONSTRAINT "UQ_894a8151f2433fca9b81acb2975" UNIQUE ("product_name"), CONSTRAINT "UQ_464f927ae360106b783ed0b4106" UNIQUE ("slug"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "spu_sku_mapping" ("id" SERIAL NOT NULL, "spu_id" integer, "sku_id" integer, CONSTRAINT "REL_02c79fa35c17746bf4beeb39c4" UNIQUE ("sku_id"), CONSTRAINT "PK_bf06c01025e9bb9f53eca413d31" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "prices" ("product_sku_id" integer NOT NULL, "begin_at" TIMESTAMP NOT NULL, "selling_price" double precision NOT NULL, "display_price" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e5581f7546763b64fa0e988dc97" PRIMARY KEY ("product_sku_id", "begin_at"))`);
        await queryRunner.query(`CREATE TABLE "suppliers" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "address" text, "phone" character varying(15), "email" character varying(100), CONSTRAINT "PK_b70ac51766a9e3144f778cfe81e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invoices" ("id" SERIAL NOT NULL, "invoice_code" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "tax_code" character varying(20) NOT NULL, "order_id" integer, "employee_id" integer, CONSTRAINT "UQ_990e8735a3595990a98fb52efaf" UNIQUE ("invoice_code"), CONSTRAINT "REL_ea83c3b911906a3578de2340fd" UNIQUE ("order_id"), CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('PENDING', 'CANCELED', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'COMPLETED', 'RETURNED', 'REFUNDED')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'PENDING', "order_type" boolean NOT NULL DEFAULT true, "shipping_address" text NOT NULL, "contact_phone" character varying(15) NOT NULL, "shipping_method" character varying(50) NOT NULL, "payment_method" character varying(50) NOT NULL, "note" text, "shipping_fee" numeric(10,2) NOT NULL DEFAULT '0', "discount" numeric NOT NULL DEFAULT '0', "postcode" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "employee_id" integer, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_details" ("order_id" integer NOT NULL, "product_serial_id" uuid NOT NULL, "unit_price" numeric(10,2) NOT NULL DEFAULT '0', "tax" numeric(5,2) NOT NULL DEFAULT '0', CONSTRAINT "PK_1389e72ee5e5ec0f1a4df954fe4" PRIMARY KEY ("order_id", "product_serial_id"))`);
        await queryRunner.query(`CREATE TABLE "product_serials" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "serial_number" character varying(100) NOT NULL, "date_manufactured" date NOT NULL, "product_sku_id" integer, "warehouse_receipt_id" integer, CONSTRAINT "UQ_9e074ff16105b74f6043eea038f" UNIQUE ("serial_number"), CONSTRAINT "PK_37833362dcb4f82757734a1965a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "warehouse_receipts" ("id" SERIAL NOT NULL, "receipt_number" character varying(50) NOT NULL, "receipt_date" date NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "purchase_order_id" integer, "employee_id" integer, CONSTRAINT "UQ_2b8396b1c15a0ee905bb33130cb" UNIQUE ("receipt_number"), CONSTRAINT "REL_006234739b38bc345a32723be4" UNIQUE ("purchase_order_id"), CONSTRAINT "PK_10bc34b8a5d29a0affe909a57b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "purchase_orders" ("id" SERIAL NOT NULL, "order_number" character varying(50) NOT NULL, "order_date" date NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "supplier_id" integer, "employee_id" integer, CONSTRAINT "UQ_b297010fff05faf7baf4e67afa7" UNIQUE ("order_number"), CONSTRAINT "PK_05148947415204a897e8beb2553" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "purchase_order_details" ("purchase_order_id" integer NOT NULL, "sku_id" integer NOT NULL, "quantity" integer NOT NULL, "unit_price" double precision NOT NULL, CONSTRAINT "PK_1dc7d4309f8646899982e32c607" PRIMARY KEY ("purchase_order_id", "sku_id"))`);
        await queryRunner.query(`CREATE TABLE "product_skus" ("id" SERIAL NOT NULL, "sku_no" character varying(32) NOT NULL, "barcode" character varying(32) NOT NULL, "sku_name" character varying(150) NOT NULL, "image" character varying(255) NOT NULL, "status" boolean NOT NULL DEFAULT true, "sku_attributes" jsonb, "slug" character varying(100) NOT NULL, CONSTRAINT "UQ_6eb36116c9cfd9a168d102116ab" UNIQUE ("sku_no"), CONSTRAINT "UQ_2f61ca6320aadc7ad6de50e0393" UNIQUE ("slug"), CONSTRAINT "PK_2acf028b6a5492960021db0273a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart_items" ("user_id" uuid NOT NULL, "product_sku_id" integer NOT NULL, "quantity" integer NOT NULL, "price_at_added" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a6e307ff65e3c081c18dcd83f25" PRIMARY KEY ("user_id", "product_sku_id"))`);
        await queryRunner.query(`CREATE TABLE "warranties" ("id" SERIAL NOT NULL, "start_date" TIMESTAMP, "end_date" TIMESTAMP, "product_serial_id" uuid, "invoice_id" integer, CONSTRAINT "PK_62c441630f8a6ddcc4bc1ab1bc5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "warranty_details" ("warranty_id" integer NOT NULL, "received_at" TIMESTAMP NOT NULL, "returned_at" TIMESTAMP, "before_status" character varying(255) NOT NULL, "after_status" character varying(255), "employee_id" integer, CONSTRAINT "PK_4eee10fd7530c209ecf04a83e68" PRIMARY KEY ("warranty_id", "received_at"))`);
        await queryRunner.query(`ALTER TABLE "employees" ADD CONSTRAINT "FK_2d83c53c3e553a48dadb9722e38" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employees" ADD CONSTRAINT "FK_8b14204e8af5e371e36b8c11e1b" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_1530a6f15d3c79d1b70be98f2be" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "spu_sku_mapping" ADD CONSTRAINT "FK_d1b7b2642298dc668e564605f6a" FOREIGN KEY ("spu_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "spu_sku_mapping" ADD CONSTRAINT "FK_02c79fa35c17746bf4beeb39c4f" FOREIGN KEY ("sku_id") REFERENCES "product_skus"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prices" ADD CONSTRAINT "FK_f81cc84a46a46bfd96da5633dc1" FOREIGN KEY ("product_sku_id") REFERENCES "product_skus"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_ea83c3b911906a3578de2340fdf" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_2bce90452b2abe8827f29831eb8" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_f8a7411077c731327ca6e0b93b6" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_details" ADD CONSTRAINT "FK_3ff3367344edec5de2355a562ee" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_details" ADD CONSTRAINT "FK_78c43bcb2d0de6d46750aa1fff6" FOREIGN KEY ("product_serial_id") REFERENCES "product_serials"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_serials" ADD CONSTRAINT "FK_392e3a295ed2e9a0eca9230b6a7" FOREIGN KEY ("product_sku_id") REFERENCES "product_skus"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_serials" ADD CONSTRAINT "FK_764c7574e2bd3aeb880f9f876c4" FOREIGN KEY ("warehouse_receipt_id") REFERENCES "warehouse_receipts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_receipts" ADD CONSTRAINT "FK_006234739b38bc345a32723be4e" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_receipts" ADD CONSTRAINT "FK_a6b543ca0b75c9fbbe1fdcf1571" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_orders" ADD CONSTRAINT "FK_d16a885aa88447ccfd010e739b0" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_orders" ADD CONSTRAINT "FK_41d7f7c3997b31bb7bc2201e268" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_order_details" ADD CONSTRAINT "FK_08f0d16ed60b199a4973097255d" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_order_details" ADD CONSTRAINT "FK_d781f9d3dc4258e557a2a6239b7" FOREIGN KEY ("sku_id") REFERENCES "product_skus"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_b7213c20c1ecdc6597abc8f1212" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_7fbc9c7d721a364e606a9875ebb" FOREIGN KEY ("product_sku_id") REFERENCES "product_skus"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warranties" ADD CONSTRAINT "FK_63f357ded4793697d36c0bb649d" FOREIGN KEY ("product_serial_id") REFERENCES "product_serials"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warranties" ADD CONSTRAINT "FK_4f6b4e3a12eb88d3492848d790e" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warranty_details" ADD CONSTRAINT "FK_0a84dbe1d0f5bf080c79b979c7f" FOREIGN KEY ("warranty_id") REFERENCES "warranties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warranty_details" ADD CONSTRAINT "FK_f5552ff164d57f30f1249707c23" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "warranty_details" DROP CONSTRAINT "FK_f5552ff164d57f30f1249707c23"`);
        await queryRunner.query(`ALTER TABLE "warranty_details" DROP CONSTRAINT "FK_0a84dbe1d0f5bf080c79b979c7f"`);
        await queryRunner.query(`ALTER TABLE "warranties" DROP CONSTRAINT "FK_4f6b4e3a12eb88d3492848d790e"`);
        await queryRunner.query(`ALTER TABLE "warranties" DROP CONSTRAINT "FK_63f357ded4793697d36c0bb649d"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_7fbc9c7d721a364e606a9875ebb"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_b7213c20c1ecdc6597abc8f1212"`);
        await queryRunner.query(`ALTER TABLE "purchase_order_details" DROP CONSTRAINT "FK_d781f9d3dc4258e557a2a6239b7"`);
        await queryRunner.query(`ALTER TABLE "purchase_order_details" DROP CONSTRAINT "FK_08f0d16ed60b199a4973097255d"`);
        await queryRunner.query(`ALTER TABLE "purchase_orders" DROP CONSTRAINT "FK_41d7f7c3997b31bb7bc2201e268"`);
        await queryRunner.query(`ALTER TABLE "purchase_orders" DROP CONSTRAINT "FK_d16a885aa88447ccfd010e739b0"`);
        await queryRunner.query(`ALTER TABLE "warehouse_receipts" DROP CONSTRAINT "FK_a6b543ca0b75c9fbbe1fdcf1571"`);
        await queryRunner.query(`ALTER TABLE "warehouse_receipts" DROP CONSTRAINT "FK_006234739b38bc345a32723be4e"`);
        await queryRunner.query(`ALTER TABLE "product_serials" DROP CONSTRAINT "FK_764c7574e2bd3aeb880f9f876c4"`);
        await queryRunner.query(`ALTER TABLE "product_serials" DROP CONSTRAINT "FK_392e3a295ed2e9a0eca9230b6a7"`);
        await queryRunner.query(`ALTER TABLE "order_details" DROP CONSTRAINT "FK_78c43bcb2d0de6d46750aa1fff6"`);
        await queryRunner.query(`ALTER TABLE "order_details" DROP CONSTRAINT "FK_3ff3367344edec5de2355a562ee"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_f8a7411077c731327ca6e0b93b6"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_2bce90452b2abe8827f29831eb8"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_ea83c3b911906a3578de2340fdf"`);
        await queryRunner.query(`ALTER TABLE "prices" DROP CONSTRAINT "FK_f81cc84a46a46bfd96da5633dc1"`);
        await queryRunner.query(`ALTER TABLE "spu_sku_mapping" DROP CONSTRAINT "FK_02c79fa35c17746bf4beeb39c4f"`);
        await queryRunner.query(`ALTER TABLE "spu_sku_mapping" DROP CONSTRAINT "FK_d1b7b2642298dc668e564605f6a"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_1530a6f15d3c79d1b70be98f2be"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_8b14204e8af5e371e36b8c11e1b"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_2d83c53c3e553a48dadb9722e38"`);
        await queryRunner.query(`DROP TABLE "warranty_details"`);
        await queryRunner.query(`DROP TABLE "warranties"`);
        await queryRunner.query(`DROP TABLE "cart_items"`);
        await queryRunner.query(`DROP TABLE "product_skus"`);
        await queryRunner.query(`DROP TABLE "purchase_order_details"`);
        await queryRunner.query(`DROP TABLE "purchase_orders"`);
        await queryRunner.query(`DROP TABLE "warehouse_receipts"`);
        await queryRunner.query(`DROP TABLE "product_serials"`);
        await queryRunner.query(`DROP TABLE "order_details"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TABLE "invoices"`);
        await queryRunner.query(`DROP TABLE "suppliers"`);
        await queryRunner.query(`DROP TABLE "prices"`);
        await queryRunner.query(`DROP TABLE "spu_sku_mapping"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "brands"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "employees"`);
        await queryRunner.query(`DROP TABLE "positions"`);
    }

}
