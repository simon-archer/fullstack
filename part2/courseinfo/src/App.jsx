const Header = (props) => {
  return (
  <h2>{props.course.name}</h2>
  )
}

const Content = ({course}) => {  
    return( 
      <>
        {course.parts.map((part, index) => (
        <p key={index}>{part.name} {part.exercises}</p>
        ))}
      </>
    )
}

const Total = ({course}) => {
  const total = course.parts.reduce((accumulator, part) => accumulator + part.exercises, 0)
  return <p><strong>Total of {total} exercises</strong></p>
}

const Course = ({course}) => {
  return (
    <div>
      <Header course={course}/>
      <Content course={course}/>
      <Total course={course}/>
    </div>
  )
}

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]
  
  return (
    <>
      <h1>Web Development Curriculum</h1>
      <Course course={courses[0]}/>
      <Course course={courses[1]}/>
    </>
  )
}

export default App