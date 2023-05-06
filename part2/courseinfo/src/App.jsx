const Header = (props) => {
  return (
  <h1>{props.course.name}</h1>
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
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        id: 1,
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        id: 2,
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        id: 3,
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  
  return <Course course={course} />
}

export default App