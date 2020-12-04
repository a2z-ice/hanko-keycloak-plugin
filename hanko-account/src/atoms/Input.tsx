import * as React from 'react'

type InputProps = {
  handleEnter: () => void
}

export class Input extends React.Component<
  InputProps & React.HTMLProps<HTMLInputElement>
> {
  componentDidMount() {
    if (this.nameInput) {
      this.nameInput.focus()
      this.nameInput.select()
    }
  }

  nameInput: HTMLInputElement | null

  keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { handleEnter } = this.props

    if (event.key == 'Enter' && handleEnter) {
      handleEnter()
    }
  }

  render() {
    return (
      <input
        className="inline"
        {...this.props}
        ref={input => {
          this.nameInput = input
        }}
        onKeyDown={this.keyDownHandler}
      ></input>
    )
  }
}
