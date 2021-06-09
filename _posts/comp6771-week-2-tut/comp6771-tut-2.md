

## Question 2

Why relationship between algos, iterators and containers important? We don't need to make algorithms and interators again and again for every new container.

Iterators allows us to provide a common interface for these containers. 
We have all these algos and containers, and we just need to plug in the start and end iterator, and we can run these algorithms.

e.g. std::sort
we can place into std::sort any container (even string)! This is because of iterators, all its asking for is the range of elements to sort, which comes from the iterator.

How does this relate to DRY?
- You don't need to write a sort for vector. When you introduce a string container, you don't need to repeat yourself and write another algorithm for the string. 
- You write a common sorting algo that both containers can use.

## Question 3
input iterator:
- we can read, increment, but can only do one pass

output:
- write and increment as well

foward:
- sort of like a linked list, can only go forward

bidirectional:
- you can go forward and backwards

random access:
- most interesting one
- you can make comparisons
- dont need to start at either end, we can go anywhere
- += is allowed with random access
- brackets means you can access via index

## Question 4

Why use const iterator?
when you have a const iterator, you can still increment, the only thing is you cant then dereference the iterator like `*it = 4` with a const iterator.
not allowed to modify the container
why would you want to do this?
to control who can modify a container

if constant iterators exists because of constant declarations.

```
auto const v  = std::vector<int>{1,2,3};
v.begin() // this is a constant iterator
```

You can just read from it, cant edit elementi, is because we have stuff like constant vectors, constant strings, when you do v.begin() it will return a constant iterator.

## Question 5
which algorithms

no contains for vectors. only for maps (c++ 20) use the .find instead

just replace it with find()

rotate()

## Question 6


```cpp
const std::vector<int> vec; // random iterator (-> [] indicates it's random access iterator)
std::list<int> li;
std::forward_list<double> forward_li;
std::string s;

vec.begin(); // returns constant iterator at start. Automatically constant which we can't edit the elements with
vec.cbegin(); // returns a constant iterator at start. 
(*vec.begin())++; // compile error, you are allowed to dereference the iterator, but not allowed to change the value and increment it
li.cbegin(); // returns bidirectional constant iterator (because of the cbegin)
li.rbegin(); // returns bidirectional reverse nonconstant iterator, incrementing it decrements the iterator
forward_li.cbegin(); // returns forward nonconstant iterator
(*forward_li.cbegin())++;
forward_li.crbegin();
s.begin();
std::back_inserter(vec);
std::back_inserter(li);
std::istream_iterator<int>(std::cin);
std::ostream_iterator<int>(std::cout, " ");
```

it++ gives us a penalty in c++ as we make a copy of the iterator
so ++it is the better option


## Question 7

> For the remainder of questions, you'll be asked to write a function or a program (i.e. also write a
> `main` function). You should also write a test case for each of them in the corresponding files in
> the `test` directory.
> 
> Write a function that sorts a vector of strings in _descending_ order.
> 
> You should write your algorithm in `source/sort_descending.cpp` and your test in
> `test/sort_descending.cpp`.

function on integers in descending order

```
auto sort_descending


## Question 11
check if a string is a permutation of another string?

