import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialHotelSyncSchema1731140000000 implements MigrationInterface {
  name = 'InitialHotelSyncSchema1731140000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create enum types
    await queryRunner.query(`
      CREATE TYPE "hotel_status_enum" AS ENUM('DRAFT', 'LIVE', 'INACTIVE');
    `);

    await queryRunner.query(`
      CREATE TYPE "reservation_status_enum" AS ENUM('CONFIRMED', 'CANCELLED', 'CHECKED_IN', 'CHECKED_OUT');
    `);

    // 2. Create hotels table
    await queryRunner.query(`
      CREATE TABLE "hotels" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying(255) NOT NULL,
        "pmsType" character varying(50) NOT NULL DEFAULT 'fake-pms',
        "pmsHotelId" character varying(100) NOT NULL,
        "status" "hotel_status_enum" NOT NULL DEFAULT 'LIVE',
        "floorPrice" numeric(10,2) NOT NULL DEFAULT '50.00',
        "ceilingPrice" numeric(10,2) NOT NULL DEFAULT '500.00',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_hotels_id" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_hotels_pmsHotelId" ON "hotels" ("pmsHotelId");
    `);

    // 3. Create room_types table
    await queryRunner.query(`
      CREATE TABLE "room_types" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "hotelId" uuid NOT NULL,
        "pmsRoomTypeId" character varying(100) NOT NULL,
        "name" character varying(255) NOT NULL,
        "capacity" integer NOT NULL DEFAULT 2,
        "rateDifferential" numeric(5,2) NOT NULL DEFAULT '1.00',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_room_types_hotel_pmsRoomTypeId" UNIQUE ("hotelId", "pmsRoomTypeId"),
        CONSTRAINT "PK_room_types_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_room_types_hotelId" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_room_types_hotelId" ON "room_types" ("hotelId");
    `);

    // 4. Create reservations table
    await queryRunner.query(`
      CREATE TABLE "reservations" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "hotelId" uuid NOT NULL,
        "roomTypeId" uuid,
        "pmsReservationId" character varying(100) NOT NULL,
        "guestName" character varying(255) NOT NULL,
        "checkIn" date NOT NULL,
        "checkOut" date NOT NULL,
        "status" "reservation_status_enum" NOT NULL DEFAULT 'CONFIRMED',
        "totalAmount" numeric(10,2) NOT NULL DEFAULT '0.00',
        "currency" character varying(3) NOT NULL DEFAULT 'USD',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_reservations_hotel_pmsReservationId" UNIQUE ("hotelId", "pmsReservationId"),
        CONSTRAINT "PK_reservations_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_reservations_hotelId" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_reservations_roomTypeId" FOREIGN KEY ("roomTypeId") REFERENCES "room_types"("id") ON DELETE SET NULL ON UPDATE NO ACTION
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_reservations_hotelId" ON "reservations" ("hotelId");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_reservations_hotel_dates" ON "reservations" ("hotelId", "checkIn", "checkOut");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes and tables in reverse order
    await queryRunner.query(`DROP INDEX "IDX_reservations_hotel_dates";`);
    await queryRunner.query(`DROP INDEX "IDX_reservations_hotelId";`);
    await queryRunner.query(`DROP TABLE "reservations";`);

    await queryRunner.query(`DROP INDEX "IDX_room_types_hotelId";`);
    await queryRunner.query(`DROP TABLE "room_types";`);

    await queryRunner.query(`DROP INDEX "IDX_hotels_pmsHotelId";`);
    await queryRunner.query(`DROP TABLE "hotels";`);

    await queryRunner.query(`DROP TYPE "reservation_status_enum";`);
    await queryRunner.query(`DROP TYPE "hotel_status_enum";`);
  }
}

