module auctionhouse::table_vector {

    use aptos_std::table::{Self, Table};

    // Errors
    const ERR_INDEX_OUT_OF_BOUNDS: u64 = 0;

    struct TableVector<phantom T: store> has key, store {
        table: Table<u64, T>,
        len: u64
    }

    public fun new<T: store>(): TableVector<T> {
        TableVector<T> {
            table: table::new<u64, T>(),
            len: 0,
        }
    }

    public fun len<T: store>(table_vector: &TableVector<T>): u64 {
        table_vector.len
    }

    public fun is_empty<T: store>(table_vector: &TableVector<T>): bool {
        table_vector.len == 0
    }

    /// Acquire an immutable reference to the value which `key` maps to.
    /// Aborts if there is no entry for `key`.
    public fun get_borrow<T: store>(table_vector: &TableVector<T>, key: u64): &T {
        if (key >= table_vector.len) {
            abort ERR_INDEX_OUT_OF_BOUNDS
        } else {
            table::borrow<u64, T>(&table_vector.table, key)
        }
    }

    /// Acquire a mutable reference to the value which `key` maps to.
    /// Aborts if there is no entry for `key`.
    public fun get_borrow_mut<T: store>(table_vector: &mut TableVector<T>, key: u64): &mut T {
        if (key >= table_vector.len) {
            abort ERR_INDEX_OUT_OF_BOUNDS
        } else {
            table::borrow_mut<u64, T>(&mut table_vector.table, key)
        }
    }

    /// Removes the last element from a vector and returns it without deserializing, or `None` if it is empty.
    public fun pop<T: store>(table_vector: &mut TableVector<T>): T {
        if (table_vector.len == 0) {
            abort ERR_INDEX_OUT_OF_BOUNDS
        } else {
            let result = table::remove<u64, T>(&mut table_vector.table, table_vector.len);
            table_vector.len = table_vector.len - 1;
            result
        }
    }

    /// Pushes new element to the end of table_vector
    public fun push<T: store>(table_vector: &mut TableVector<T>, element: T) {
        table::add<u64, T>(&mut table_vector.table, table_vector.len, element);
        table_vector.len = table_vector.len + 1;
    }

    /// Replaces element in table_vector and returns evicted element
    public fun replace<T: store>(table_vector: &mut TableVector<T>, index: u64, new_value: T): T {
        if (index >= table_vector.len) {
            abort ERR_INDEX_OUT_OF_BOUNDS
        } else {
            let result = table::remove<u64, T>(&mut table_vector.table, index);
            table::add<u64, T>(&mut table_vector.table, table_vector.len, new_value);
            result
        }
    }

    /// Removes an element from the vector and returns it.
    /// The removed element is replaced by the last element of the vector.
    /// Does not preserve ordering, but is `O(1)`.
    /// Aborts if `index` is out of bounds.
    public fun swap_remove<T: store>(table_vector: &mut TableVector<T>, index: u64): T {
        if (index >= table_vector.len) {
            abort ERR_INDEX_OUT_OF_BOUNDS
        } else if (index + 1 == table_vector.len) {
            pop(table_vector)
        } else {
            let last_element = pop(table_vector);
            replace(table_vector, index, last_element)
        }
    }


}