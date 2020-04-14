## Redis in memory cache

For fast checking the bluetooth hashes.

## We want a fast scalable way to save

What is the maximum number of keys a single Redis instance can hold? and what is the max number of elements in a Hash, List, Set, Sorted Set?
Redis can handle up to 232 keys, and was tested in practice to handle at least 250 million keys per instance.

Every hash, list, set, and sorted set, can hold 232 elements.

In other words your limit is likely the available memory in your system.
Source: https://redis.io/topics/faq
