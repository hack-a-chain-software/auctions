module auctionhouse::table_set {

    use aptos_std::table::{Self, Table};
    use auctionhouse::table_vector::{Self, TableVector};

    // Errors
    const ERR_INDEX_OUT_OF_BOUNDS: u64 = 0;

    struct TableSet<phantom T: copy + drop + store> has key, store {
        table: Table<T, bool>,
        aux_vector: TableVector<T>
    }

    public fun new<T: copy + drop + store>(): TableSet<T> {
        TableSet<T> {
            table: table::new<T, bool>(),
            aux_vector: table_vector::new<T>(),
        }
    }

    /// Checks if item is contained in set
    public fun contains<T: copy + drop + store>(table_set: &TableSet<T>, key: T): bool {
        if (table::contains(&table_set.table, key)) {
            *table::borrow(&table_set.table, key)
        } else {
            false
        }
    }

    /// Inserts new item into set
    public fun insert<T: copy + drop + store>(table_set: &mut TableSet<T>, key: T) {
        if (!table::contains(&table_set.table, key)) {
            table_vector::push(&mut table_set.aux_vector, key);
        };
        table::upsert(&mut table_set.table, key, true);
    }

    /// Removes item from set
    public fun remove<T: copy + drop + store>(table_set: &mut TableSet<T>, key: T) {
        if (table::contains(&table_set.table, key)) {
            table::upsert(&mut table_set.table, key, false);
        }
    }

}