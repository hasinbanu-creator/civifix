"""
Migration script to convert district field from string to ObjectId
Run this before deploying the new version with ObjectId district references

Usage: python -m app.scripts.migrate_district_to_objectid
"""
import asyncio
import logging
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

logger = logging.getLogger(__name__)


async def migrate_district_to_objectid(db: AsyncIOMotorDatabase):
    """
    Migrate all users' district field from string (district name) to ObjectId

    Args:
        db: MongoDB database instance
    """
    print("=" * 60)
    print("DISTRICT FIELD MIGRATION - STRING TO OBJECTID")
    print("=" * 60)
    print()

    try:
        users_collection = db["users"]
        districts_collection = db["districts"]

        # Get all users with string district field
        string_district_users = await users_collection.find(
            {"district": {"$type": "string"}}
        ).to_list(length=None)

        print(f"Found {len(string_district_users)} users with string district field")
        print()

        if not string_district_users:
            print("✓ No migration needed - all users have ObjectId districts")
            return {
                "status": "success",
                "message": "No migration needed",
                "migrated": 0,
                "errors": []
            }

        migrated_count = 0
        error_count = 0
        errors = []

        # Process each user
        for user in string_district_users:
            user_id = user.get("_id")
            district_name = user.get("district")

            try:
                # Find district by name
                district = await districts_collection.find_one(
                    {"name": {"$regex": f"^{district_name}$", "$options": "i"}}
                )

                if not district:
                    error_msg = f"User {user_id} ({user.get('email')}): District '{district_name}' not found"
                    print(f"✗ {error_msg}")
                    errors.append(error_msg)
                    error_count += 1
                    continue

                # Update user with ObjectId
                result = await users_collection.update_one(
                    {"_id": user_id},
                    {
                        "$set": {
                            "district": district["_id"],
                            "district_updated_at": datetime.utcnow()
                        }
                    }
                )

                if result.modified_count > 0:
                    print(f"✓ User {user.get('email')} ({user_id}): "
                          f"'{district_name}' → {district['_id']}")
                    migrated_count += 1
                else:
                    error_msg = f"User {user_id} ({user.get('email')}): Update failed"
                    print(f"✗ {error_msg}")
                    errors.append(error_msg)
                    error_count += 1

            except Exception as e:
                error_msg = f"User {user_id}: {str(e)}"
                print(f"✗ {error_msg}")
                errors.append(error_msg)
                error_count += 1

        print()
        print("=" * 60)
        print("MIGRATION SUMMARY")
        print("=" * 60)
        print(f"Total users processed: {len(string_district_users)}")
        print(f"Successfully migrated: {migrated_count}")
        print(f"Errors: {error_count}")

        if errors:
            print()
            print("ERRORS ENCOUNTERED:")
            for error in errors:
                print(f"  - {error}")

        print()
        print("✓ Migration complete!")
        print()

        return {
            "status": "success" if error_count == 0 else "partial",
            "migrated": migrated_count,
            "errors": errors,
            "error_count": error_count
        }

    except Exception as e:
        error_msg = f"Migration failed: {str(e)}"
        print(f"✗ {error_msg}")
        logger.error(error_msg, exc_info=True)
        return {
            "status": "error",
            "message": error_msg,
            "migrated": 0,
            "errors": [error_msg]
        }


async def verify_migration(db: AsyncIOMotorDatabase):
    """
    Verify migration by checking if any string districts remain

    Args:
        db: MongoDB database instance
    """
    print()
    print("=" * 60)
    print("VERIFYING MIGRATION")
    print("=" * 60)
    print()

    try:
        users_collection = db["users"]

        # Check for remaining string districts
        remaining = await users_collection.count_documents(
            {"district": {"$type": "string"}}
        )

        object_id_count = await users_collection.count_documents(
            {"district": {"$type": "objectId"}}
        )

        print(f"Users with ObjectId districts: {object_id_count}")
        print(f"Users with string districts: {remaining}")

        if remaining == 0:
            print()
            print("✓ VERIFICATION PASSED - All districts are ObjectIds")
            return True
        else:
            print()
            print("✗ VERIFICATION FAILED - Some districts are still strings")
            return False

    except Exception as e:
        print(f"✗ Verification failed: {str(e)}")
        logger.error(f"Verification error: {str(e)}", exc_info=True)
        return False


async def main():
    """Main migration entry point"""
    from app.db.mongodb import get_database

    try:
        db = await get_database()

        # Run migration
        result = await migrate_district_to_objectid(db)

        # Verify migration
        if result["status"] in ["success", "partial"]:
            is_valid = await verify_migration(db)

            if is_valid:
                print()
                print("✓ Migration completed successfully!")
                return 0
            else:
                print()
                print("⚠ Migration completed with verification issues")
                return 1
        else:
            print()
            print("✗ Migration failed")
            return 2

    except Exception as e:
        print(f"✗ Fatal error: {str(e)}")
        logger.error(f"Fatal error: {str(e)}", exc_info=True)
        return 2


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)
