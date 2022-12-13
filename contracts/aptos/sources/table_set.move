module auctionhouse::table_set {

    use aptos_std::table::{Self, Table};

    // Errors
    const ERR_INDEX_OUT_OF_BOUNDS: u64 = 0;

    struct TableSet<phantom T: copy + drop> has key, store {
        table: Table<T, bool>,
        len: u64,
    }

    public fun new<T: copy + drop>(): TableSet<T> {
        TableSet<T> {
            table: table::new<T, bool>(),
            len: 0,
        }
    }

    public fun len<T: copy + drop>(table_set: &TableSet<T>): u64 {
        table_set.len
    }

    /// Checks if item is contained in set
    public fun contains<T: copy + drop>(table_set: &TableSet<T>, key: T): bool {
        table::contains(&table_set.table, key)
    }

    /// Inserts new item into set
    public fun insert<T: copy + drop>(table_set: &mut TableSet<T>, key: T) {
        if (!table::contains(&table_set.table, key)) {
            table_set.len = table_set.len + 1;
        };
        table::upsert(&mut table_set.table, key, true);
    }

    /// Removes item from set
    public fun remove<T: copy + drop>(table_set: &mut TableSet<T>, key: T) {
        if (table::contains(&table_set.table, key)) {
            table::remove(&mut table_set.table, key);
            table_set.len = table_set.len - 1;
        }
    }

}