+++
title = "Learn GraphQL By Example"
date = "2017-12-28T13:35:28-08:00"
tags = ["graphql"]
topics = []
description = "An introduction to GraphQL with examples and comparison to REST"
+++

I have been using GraphQL in my work project for a few months now and I love it. But all my learnings of this technology have been in a hurry and mainly from a consumption standpoint as a mobile developer. So I wanted to learn it much deeper, tinker with it and finally write this blog to share my learnings and cement my understanding. Finally got the time to do it this weekend. 

In this post, we learn what GraphQL is, the key concepts and how does it compare with the classic REST model - all with a lot of examples. All the content here is mainly based on what I learned from [GraphQL official docs](http://graphql.org/learn/) and the excellent [GitHub GraphQL V4 API documentation](https://developer.github.com/v4/).

## What is GraphQL?
[GraphQL](http://graphql.org/) is an API query language and a runtime for fulfilling those queries using a type system that you define for your data. It was built by Facebook in 2012 as part of the effort to rebuild their native mobile applications and was open-sourced in 2015. 

GraphQL creates a uniform API for your entire application that gives the clients the power to ask for exactly what they need, nothing more and nothing less. GraphQL queries can access multiple resources in a single request. GraphQL isn't tied to any specific database or storage engine and is instead backed by your existing code and data. That means you can create GraphQL services by leveraging your existing code / data and using GraphQL engines avaiable in many languages  (Java/PHP/C# etc.). 

In essence, GraphQL has three main parts - Specification, Query Language and Runtime

* **Specification** determines the validity of the schema on the API server
* **Language** defines the queries (for read), mutations (for write), subscriptions, fragments
* **Runtime** provides validation, introspection, execution, type system of the schema

## An Example
As an example, if you want to create a GraphQL service that provides a list of users in your database and some basic information about the user, you can define a **User** type as follows:

```
type Query {
  users: [User]
}

type User {
  id: Int
  name: String
}
```

and then define the functions corresponding to each fields on the type
``` JavaScript
function Query_users(request) {
  return mydb.users;
}
function User_name(user) {
  return user.getName();
}
```


Then you run the service on a secure URL endpoint and send GraphQL queries to that service. The service validated the request, makes sure that it refers to well defined types only and then executes the query by invoking the provided functions and returns the result.

In the above example, a query like ths:
```
{
  users {
    name
  }
}
```

will produce the following JSON result:
``` JSON
{
  "users": [
    { "name": "Morpheus" },
    { "name": "Neo" },
    { "name": "Trinity" }
  ]
```

You can run these queries using an API explorer provided by the GraphQL server (for example, see [Github's API explorer](https://developer.github.com/v4/explorer/)). Alternately, you can run it using curl - see the example below:

```
curl -H "Authorization: bearer token" -X POST -d " \
{ \
\"query\": \"query { viewer { login }}\" \
} \" _https://api.github.com/graphql
```


## Unique Features of GraphQL

As we have seen so far, here are the unique features of GraphQL that sets it apart:

* **Defines the shape of the data** - GraphQL queries mirror their response which makes it easy to write a query if you know the data your app needs.
* **Strongly typed** - schema defines the API type system. Each level of the query corresponds to a type and each type contains a set of fields which in turn may be nested types.
* **Introspective** - client can query the GraphQL server for the schema of the data. So you can write a (meta) GraphQL query to get the fields of the GraphQL schema. 
  
    Here is an example:

    ```
    query {
      __schema {
        types {
          name
          kind
          description
          fields {
              name
          }
        }
      }
    }
    ```
* **Hierarchical** - shape of the query mirrors the shape of the schema. The term 'graph' in GraphQL refers to graph structures defined in the schema, where nodes define objects and edges define connections between objects. When you query a connection, you traverse its edges to get to its nodes. Every "edges" field has a "node" field and a "cursor" field (for pagination).

* **Version free** - GraphQL follows a Single Evolving Version model where the query determines the shape of the data instead oa version of the API. So APIs can evolve without versions by adding new fields / types and deprecating aging fields.

    ``` Java
    type {   
      User {   
        name: String
        avatar: String
        character: String @deprecated
      }    
    }
    ```

* **Great Tooling** - It also provides powerful developer tools like [GraphiQL](https://github.com/graphql/graphiql), an in-browser IDE to explore GraphQL and know the request/response of the GraphQL service before writing the code. 

## GraphQL vs. REST

As you may have realized by now, GraphQL is essentially a technology that involves sending / receiving an HTTP request / response. So you may wonder how it compares to the classic REST model which is also built for the same purpose. What are the similarities and/or differences between GraphQL and REST? Let's explore that a bit here.

* REST is centered around the concept of a **resource** (for eg: User, Book etc.), where each resource is identified by a URL (endpoint). On the otherhand, GraphQL APIs are organized in terms of **types** in the schema. This ensures that the client apps ask for only what is possible and they can avoid hand-written code to parse JSON response.

*  In REST, you retrieve the resource by sending a GET request to the resource's URL, for example `GET /users/10100`. As you can see here, the way you fetch a resource is coupled with the *type* of the resource. In contrast, GraphQL keeps these two concepts separate because your schema contains the definition for all your *types* and you fetch the data using a single URL https://api.github.com/graphql
  
* GraphQL gives the clients the power to ask for exactly what they need, nothing more and nothing less. REST does not provide that level of granularity as the server sends all the data associated with the resource and the client has to parse out what it needs after the response reaches it.

* GraphQL queries can access multiple resources in a single request originated from the client. In the REST world, client will have to send multiple requests - one for reach resource. This 

* In REST, every operation that can be performed on the resource (read/add/edit/delete) are specified by HTTP verbs (*GET/POST/PUT/DELETE*) in the request. In GraphQL, the operations (query/mutation) are specified in the JSON encoded bosy of the request and the hTTP verb is almost always *POST* (except for Introspection of schema which uses GET)

* In REST, the shape and size of the resource is determined by the server. In GraphQL, the server declares what resources are available; the client asks for what it needs.


## Key Concepts - Operations & Resolvers

Let's go a little deeper to understand the key concepts of GraphQL. 

The two types of operations allowed in GraphQL are *queries* and *mutations*. Every GraphQL schema has a root type for both queries and mutations.

### Queries

Query is an operation that defines what we want to get from the GraphQL server. Queries return only the data that you ask for and a query has the same shape as the result. You create a query by specifying the fields (top-level fields or nested fields) of the types until every leaf node is a scalar. You can also have pass *arguments* to every field and nested object in the query. Queries can also include reusable snippets called *fragments* that help in splitting complex queries into smaller chunks and avoid repetition of fields.

  Here is a sample query that fetches a github issue from the repository https://github.com/octocat/Hello-World/issues/392:

```
query {
  repository(owner:"octocat", name:"Hello-World") {
      issue(number:349) {
        id
      }
  }
}
```

### Mutations
Mutation is an operation to execute a modification on an object. You form a mutation by specifying three things:
 * **mutationName** - type of modification that you want to perform
 * **Input object** - the data that you want to send to server, composed of input fields. Pass  *  argument to the mutationName
 * **Payload object** - the data that you want to return from the server. Pass it as the body of the mutationName

This is how a mutation is structured:
```
mutation {
  mutationName(input: {MutationNameInput!}) {
    MutationNamePayload
}
```

And here is a sample mutation that adds a *HOORAY* reaction to the above github repo:
```
mutation AddReactionToIssue {
  addReaction(input:{subjectId:"MDU6SXNzdWUyMzEzOTE1NTE=",content:HOORAY}) {
    reaction {
      content
    }
    subject {
      id
    }
  }
}
```

You can execute the above query and mutation in the GitHub API explorer after you login with your github credentials - https://developer.github.com/v4/explorer/. 

### Resolvers
Resolvers are the server side functions that a GraphQL API developer writes to fulfill the queries and mutations. Using these resolvers, the GraphQL execution library builds up the response to match the shape of the query and sends the response to the client. See here a few resolvers in JavaScript:

``` JavaScript
const resolvers = {
    Query: {
        hello: () => {
            return 'Hello world!';
        },
        author: (root, { id }) => {
            find(authors, { id: id })
        },
    },
    Author: {
        posts: (author) => filter(posts, { authorId: author.id }),
    }
};
```

## Conclusion
As we have seen so far, GraphQL is an excellent solution that can power all data fetching requirements of client applications. It can be a complete replacement for resource-dependent REST services, orchestration services and custom services custom-built for applications. What I love the most about GraphQL is how it solves the data-fetching problem from the application developer's point of view without compromising the server-side developer's desire to create flexible maintainable code.

## References

Of course there is a lot more to explore and experiment to get a deep understanding of the technology. The specific topics I would like to explore are the Single Version model and the advanced type systems (Union Types, Interface Types etc.) 
Here is a list of some great articles and documentation to learn more.

* GraphQL main learning site - http://graphql.org/learn/
* GraphQL docs on Github V4 API - https://developer.github.com/v4/
* GraphQL type system - http://graphql.org/learn/schema
* GraphQL vs. REST – Apollo GraphQL - https://dev-blog.apollodata.com/graphql-vs-rest-5d425123e34b
* Facebook's post on GraphQL - an excellent description of why they built GraphQL https://code.facebook.com/posts/1691455094417024/graphql-a-data-query-language/
* Details on Schema - https://github.com/apollographql/graphql-guide/blob/master/source/schemas.md
* Write you first GraphQL server - https://medium.com/the-graphqlhub/your-first-graphql-server-3c766ab4f0a2



